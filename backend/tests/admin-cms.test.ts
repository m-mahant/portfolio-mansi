import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../src/app';
import { setCustomTokenVerifier } from '../src/utils/auth.utils';
import { adminRepository } from '../src/repositories/admin.repository';
import { clearInMemoryProjects } from '../src/repositories/project.repository';
import { clearInMemoryArtworks } from '../src/repositories/artwork.repository';

// Helper to set up mock active admin authentication credentials for supertest API requests.
function setupAdminAuthMock(role: 'admin' | 'viewer' = 'admin'): () => void {
  const originalGetAdmin = adminRepository.getAdminByUid;

  setCustomTokenVerifier(async () => ({
    uid: 'active_admin_cms_uid',
    email: 'admin@example.com',
    email_verified: true,
    auth_time: Date.now(),
    iss: '',
    sub: 'active_admin_cms_uid',
    aud: '',
    exp: Date.now() + 3600,
    firebase: { identities: {}, sign_in_provider: 'password' },
  }));

  (adminRepository as { getAdminByUid: typeof originalGetAdmin }).getAdminByUid = async () => ({
    uid: 'active_admin_cms_uid',
    role,
    isActive: true,
  });

  return () => {
    setCustomTokenVerifier(null);
    (adminRepository as { getAdminByUid: typeof originalGetAdmin }).getAdminByUid = originalGetAdmin;
  };
}

describe('Admin CMS Backend APIs Security & CRUD Integration', () => {
  beforeEach(() => {
    clearInMemoryProjects();
    clearInMemoryArtworks();
  });

  it('GET /api/v1/admin/site should return 401 UNAUTHORIZED when no authorization token is supplied', async () => {
    const res = await request(app).get('/api/v1/admin/site');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'UNAUTHORIZED');
  });

  it('GET /api/v1/admin/site should return 403 FORBIDDEN when user has non-admin role', async () => {
    const cleanupAuth = setupAdminAuthMock('viewer');
    try {
      const res = await request(app)
        .get('/api/v1/admin/site')
        .set('Authorization', 'Bearer mock_viewer_token');

      assert.equal(res.status, 403);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'FORBIDDEN');
    } finally {
      cleanupAuth();
    }
  });

  describe('Site Settings API (/api/v1/admin/site)', () => {
    it('GET & PATCH /api/v1/admin/site should retrieve and update site settings', async () => {
      const cleanupAuth = setupAdminAuthMock();
      try {
        const getRes = await request(app)
          .get('/api/v1/admin/site')
          .set('Authorization', 'Bearer mock_admin_token');

        assert.equal(getRes.status, 200);
        assert.equal(getRes.body.success, true);
        assert.ok(getRes.body.data.siteName);

        const patchRes = await request(app)
          .patch('/api/v1/admin/site')
          .set('Authorization', 'Bearer mock_admin_token')
          .send({ siteTitle: 'Updated Portfolio Title' });

        assert.equal(patchRes.status, 200);
        assert.equal(patchRes.body.success, true);
        assert.equal(patchRes.body.data.siteTitle, 'Updated Portfolio Title');
      } finally {
        cleanupAuth();
      }
    });
  });

  describe('About Profile API (/api/v1/admin/about)', () => {
    it('GET & PATCH /api/v1/admin/about should retrieve and update about profile', async () => {
      const cleanupAuth = setupAdminAuthMock();
      try {
        const getRes = await request(app)
          .get('/api/v1/admin/about')
          .set('Authorization', 'Bearer mock_admin_token');

        assert.equal(getRes.status, 200);
        assert.equal(getRes.body.success, true);

        const patchRes = await request(app)
          .patch('/api/v1/admin/about')
          .set('Authorization', 'Bearer mock_admin_token')
          .send({ introduction: 'Updated Software & Digital Art Engineer' });

        assert.equal(patchRes.status, 200);
        assert.equal(patchRes.body.success, true);
        assert.equal(patchRes.body.data.introduction, 'Updated Software & Digital Art Engineer');
      } finally {
        cleanupAuth();
      }
    });
  });

  describe('Social Links API (/api/v1/admin/social-links)', () => {
    it('POST, GET, PATCH, DELETE /api/v1/admin/social-links lifecycle', async () => {
      const cleanupAuth = setupAdminAuthMock();
      try {
        const createRes = await request(app)
          .post('/api/v1/admin/social-links')
          .set('Authorization', 'Bearer mock_admin_token')
          .send({
            platform: 'GitHub',
            label: 'GitHub Profile',
            url: 'https://github.com/example',
            displayOrder: 1,
            isVisible: true,
          });

        assert.equal(createRes.status, 201);
        assert.equal(createRes.body.success, true);
        const createdId = createRes.body.data.id;
        assert.ok(createdId);

        const listRes = await request(app)
          .get('/api/v1/admin/social-links')
          .set('Authorization', 'Bearer mock_admin_token');

        assert.equal(listRes.status, 200);
        assert.equal(listRes.body.success, true);
        assert.ok(Array.isArray(listRes.body.data));

        const patchRes = await request(app)
          .patch(`/api/v1/admin/social-links/${createdId}`)
          .set('Authorization', 'Bearer mock_admin_token')
          .send({ label: 'Updated GitHub Profile Label' });

        assert.equal(patchRes.status, 200);
        assert.equal(patchRes.body.data.label, 'Updated GitHub Profile Label');

        const deleteRes = await request(app)
          .delete(`/api/v1/admin/social-links/${createdId}`)
          .set('Authorization', 'Bearer mock_admin_token');

        assert.equal(deleteRes.status, 200);
        assert.equal(deleteRes.body.success, true);
      } finally {
        cleanupAuth();
      }
    });
  });

  describe('Projects API (/api/v1/admin/projects)', () => {
    it('POST /api/v1/admin/projects should normalize slug, validate draft status, and calculate sections', async () => {
      const cleanupAuth = setupAdminAuthMock();
      const uniqueTitle = `Sample E-Commerce Engine ${Date.now()}`;
      const expectedSlug = uniqueTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      try {
        const createRes = await request(app)
          .post('/api/v1/admin/projects')
          .set('Authorization', 'Bearer mock_admin_token')
          .send({
            title: uniqueTitle,
            shortDescription: 'High performance shopping API',
            overview: 'Detailed overview text of architecture',
            status: 'draft',
          });

        assert.equal(createRes.status, 201);
        assert.equal(createRes.body.success, true);
        assert.equal(createRes.body.data.slug, expectedSlug);
        assert.equal(createRes.body.data.sections.overview, true);
        assert.equal(createRes.body.data.sections.problem, false);
      } finally {
        cleanupAuth();
      }
    });

    it('POST /api/v1/admin/projects should return 409 CONFLICT on duplicate slug', async () => {
      const cleanupAuth = setupAdminAuthMock();
      const dupSlug = `unique-proj-slug-${Date.now()}`;
      try {
        await request(app)
          .post('/api/v1/admin/projects')
          .set('Authorization', 'Bearer mock_admin_token')
          .send({
            title: 'Unique Project One',
            slug: dupSlug,
            shortDescription: 'Short description',
            status: 'draft',
          });

        const duplicateRes = await request(app)
          .post('/api/v1/admin/projects')
          .set('Authorization', 'Bearer mock_admin_token')
          .send({
            title: 'Another Project With Same Slug',
            slug: dupSlug,
            shortDescription: 'Short description',
            status: 'draft',
          });

        assert.equal(duplicateRes.status, 409);
        assert.equal(duplicateRes.body.success, false);
        assert.equal(duplicateRes.body.error.code, 'CONFLICT');
      } finally {
        cleanupAuth();
      }
    });

    it('POST /api/v1/admin/projects should return 400 BAD_REQUEST when publishing without required coverImage', async () => {
      const cleanupAuth = setupAdminAuthMock();
      try {
        const publishRes = await request(app)
          .post('/api/v1/admin/projects')
          .set('Authorization', 'Bearer mock_admin_token')
          .send({
            title: 'Publish Test Without Cover',
            shortDescription: 'Missing cover image',
            status: 'published',
          });

        assert.equal(publishRes.status, 400);
        assert.equal(publishRes.body.success, false);
        assert.equal(publishRes.body.error.code, 'BAD_REQUEST');
      } finally {
        cleanupAuth();
      }
    });
  });

  describe('Artworks API (/api/v1/admin/artworks)', () => {
    it('POST /api/v1/admin/artworks should normalize slug, validate category, and calculate sections', async () => {
      const cleanupAuth = setupAdminAuthMock();
      const uniqueTitle = `Cyberpunk Skyline ${Date.now()}`;
      const expectedSlug = uniqueTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      try {
        const createRes = await request(app)
          .post('/api/v1/admin/artworks')
          .set('Authorization', 'Bearer mock_admin_token')
          .send({
            title: uniqueTitle,
            category: '3D Render',
            description: 'Futuristic neon city illustration',
            status: 'draft',
          });

        assert.equal(createRes.status, 201);
        assert.equal(createRes.body.success, true);
        assert.equal(createRes.body.data.slug, expectedSlug);
        assert.equal(createRes.body.data.sections.description, true);
      } finally {
        cleanupAuth();
      }
    });

    it('POST /api/v1/admin/artworks should return 409 CONFLICT on duplicate slug', async () => {
      const cleanupAuth = setupAdminAuthMock();
      const dupSlug = `unique-art-slug-${Date.now()}`;
      try {
        await request(app)
          .post('/api/v1/admin/artworks')
          .set('Authorization', 'Bearer mock_admin_token')
          .send({
            title: 'Unique Artwork One',
            slug: dupSlug,
            category: 'Digital Art',
            status: 'draft',
          });

        const duplicateRes = await request(app)
          .post('/api/v1/admin/artworks')
          .set('Authorization', 'Bearer mock_admin_token')
          .send({
            title: 'Duplicate Art Title',
            slug: dupSlug,
            category: 'Digital Art',
            status: 'draft',
          });

        assert.equal(duplicateRes.status, 409);
        assert.equal(duplicateRes.body.success, false);
        assert.equal(duplicateRes.body.error.code, 'CONFLICT');
      } finally {
        cleanupAuth();
      }
    });
  });

  describe('Experience & Education APIs', () => {
    it('POST /api/v1/admin/experience should clear endDate when isCurrent is true', async () => {
      const cleanupAuth = setupAdminAuthMock();
      try {
        const createRes = await request(app)
          .post('/api/v1/admin/experience')
          .set('Authorization', 'Bearer mock_admin_token')
          .send({
            company: 'Tech Corp',
            role: 'Lead Engineer',
            startDate: '2022-01-01',
            endDate: '2025-01-01',
            isCurrent: true,
            description: 'Leading platform engineering team',
          });

        assert.equal(createRes.status, 201);
        assert.equal(createRes.body.success, true);
        assert.equal(createRes.body.data.endDate, undefined);
      } finally {
        cleanupAuth();
      }
    });

    it('POST & DELETE /api/v1/admin/education should create and delete education entry', async () => {
      const cleanupAuth = setupAdminAuthMock();
      try {
        const createRes = await request(app)
          .post('/api/v1/admin/education')
          .set('Authorization', 'Bearer mock_admin_token')
          .send({
            institution: 'University of Science',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: '2018-09-01',
            endDate: '2022-05-01',
          });

        assert.equal(createRes.status, 201);
        const id = createRes.body.data.id;

        const deleteRes = await request(app)
          .delete(`/api/v1/admin/education/${id}`)
          .set('Authorization', 'Bearer mock_admin_token');

        assert.equal(deleteRes.status, 200);
      } finally {
        cleanupAuth();
      }
    });
  });

  describe('Theme Settings API (/api/v1/admin/theme)', () => {
    it('PATCH /api/v1/admin/theme should reject unsafe injection attempts in font names', async () => {
      const cleanupAuth = setupAdminAuthMock();
      try {
        const patchRes = await request(app)
          .patch('/api/v1/admin/theme')
          .set('Authorization', 'Bearer mock_admin_token')
          .send({
            fonts: {
              headingFont: 'Cinzel<script>alert("xss")</script>',
              bodyFont: 'Inter',
              accentFont: 'Pacifico',
            },
          });

        assert.equal(patchRes.status, 400);
        assert.equal(patchRes.body.success, false);
        assert.equal(patchRes.body.error.code, 'BAD_REQUEST');
      } finally {
        cleanupAuth();
      }
    });

    it('PATCH /api/v1/admin/theme should successfully update safe theme settings', async () => {
      const cleanupAuth = setupAdminAuthMock();
      try {
        const patchRes = await request(app)
          .patch('/api/v1/admin/theme')
          .set('Authorization', 'Bearer mock_admin_token')
          .send({
            colors: {
              primary: '#4f46e5',
              secondary: '#7c3aed',
              accent: '#f43f5e',
              background: '#090d16',
              surface: '#111827',
              text: '#f9fafb',
              mutedText: '#6b7280',
              border: '#1f2937',
            },
          });

        assert.equal(patchRes.status, 200);
        assert.equal(patchRes.body.success, true);
        assert.equal(patchRes.body.data.colors.primary, '#4f46e5');
      } finally {
        cleanupAuth();
      }
    });
  });
});
