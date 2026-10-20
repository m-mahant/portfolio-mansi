import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../src/app';
import { setCustomTokenVerifier } from '../src/utils/auth.utils';
import { adminRepository } from '../src/repositories/admin.repository';
import { imagekitService } from '../src/services/imagekit.service';
import { mediaRepository } from '../src/repositories/media.repository';
import { mediaService } from '../src/services/media.service';
import { Media } from '../src/types/database.types';
import { AppError } from '../src/errors/app-error';

// Helper to configure mock active admin authentication context
function setupAdminAuthMock(): () => void {
  const originalGetAdmin = adminRepository.getAdminByUid;

  setCustomTokenVerifier(async () => ({
    uid: 'active_admin_media_uid',
    email: 'admin@example.com',
    email_verified: true,
    auth_time: Date.now(),
    iss: '',
    sub: 'active_admin_media_uid',
    aud: '',
    exp: Date.now() + 3600,
    firebase: { identities: {}, sign_in_provider: 'password' },
  }));

  (adminRepository as { getAdminByUid: typeof originalGetAdmin }).getAdminByUid = async () => ({
    uid: 'active_admin_media_uid',
    role: 'admin',
    isActive: true,
  });

  return () => {
    setCustomTokenVerifier(null);
    (adminRepository as { getAdminByUid: typeof originalGetAdmin }).getAdminByUid = originalGetAdmin;
  };
}

describe('Protected Admin Media APIs (/api/v1/admin/media)', () => {
  it('POST /api/v1/admin/media/upload should return 401 UNAUTHORIZED when no token is provided', async () => {
    const res = await request(app).post('/api/v1/admin/media/upload');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'UNAUTHORIZED');
  });

  it('GET /api/v1/admin/media should return 401 UNAUTHORIZED when no token is provided', async () => {
    const res = await request(app).get('/api/v1/admin/media');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'UNAUTHORIZED');
  });

  it('POST /api/v1/admin/media/upload should return 400 BAD_REQUEST when no file is attached', async () => {
    const cleanupAuth = setupAdminAuthMock();
    try {
      const res = await request(app)
        .post('/api/v1/admin/media/upload')
        .set('Authorization', 'Bearer mock_admin_token')
        .field('mediaType', 'site');

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'BAD_REQUEST');
    } finally {
      cleanupAuth();
    }
  });

  it('POST /api/v1/admin/media/upload should return 400 BAD_REQUEST for unsupported MIME type', async () => {
    const cleanupAuth = setupAdminAuthMock();
    try {
      const res = await request(app)
        .post('/api/v1/admin/media/upload')
        .set('Authorization', 'Bearer mock_admin_token')
        .attach('file', Buffer.from('PDF content'), {
          filename: 'doc.pdf',
          contentType: 'application/pdf',
        })
        .field('mediaType', 'site');

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'BAD_REQUEST');
    } finally {
      cleanupAuth();
    }
  });

  it('POST /api/v1/admin/media/upload should return 400 BAD_REQUEST when slug is missing for project upload', async () => {
    const cleanupAuth = setupAdminAuthMock();
    try {
      const sampleImageBuffer = Buffer.from('fake image content');
      const res = await request(app)
        .post('/api/v1/admin/media/upload')
        .set('Authorization', 'Bearer mock_admin_token')
        .attach('file', sampleImageBuffer, {
          filename: 'hero.png',
          contentType: 'image/png',
        })
        .field('mediaType', 'project');

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'BAD_REQUEST');
    } finally {
      cleanupAuth();
    }
  });

  it('POST /api/v1/admin/media/upload should return 201 CREATED on valid image upload', async () => {
    const cleanupAuth = setupAdminAuthMock();
    const origUpload = imagekitService.uploadFile;
    const origCreateRecord = mediaRepository.createMediaRecord;

    const mockMediaResult: Media = {
      id: 'media_test_123',
      provider: 'imagekit',
      fileId: 'ik_file_test_123',
      fileName: 'hero_123.png',
      url: 'https://ik.imagekit.io/mock/portfolio/site/hero_123.png',
      thumbnailUrl: 'https://ik.imagekit.io/mock/portfolio/site/tr:n-media_library_thumbnail/hero_123.png',
      folder: 'portfolio/site',
      mimeType: 'image/png',
      fileSize: 1024,
      width: 800,
      height: 600,
      displayOrder: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    imagekitService.uploadFile = async () => ({
      fileId: 'ik_file_test_123',
      name: 'hero_123.png',
      url: 'https://ik.imagekit.io/mock/portfolio/site/hero_123.png',
      thumbnailUrl: 'https://ik.imagekit.io/mock/portfolio/site/tr:n-media_library_thumbnail/hero_123.png',
      size: 1024,
      width: 800,
      height: 600,
      filePath: '/portfolio/site/hero_123.png',
    });

    mediaRepository.createMediaRecord = async () => mockMediaResult;

    try {
      const sampleImageBuffer = Buffer.from('fake image content');
      const res = await request(app)
        .post('/api/v1/admin/media/upload')
        .set('Authorization', 'Bearer mock_admin_token')
        .attach('file', sampleImageBuffer, {
          filename: 'hero.png',
          contentType: 'image/png',
        })
        .field('mediaType', 'site')
        .field('altText', 'Homepage Header Image');

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.id, 'media_test_123');
      assert.equal(res.body.data.provider, 'imagekit');
      assert.equal(res.body.data.fileId, 'ik_file_test_123');
    } finally {
      imagekitService.uploadFile = origUpload;
      mediaRepository.createMediaRecord = origCreateRecord;
      cleanupAuth();
    }
  });

  it('GET /api/v1/admin/media should return paginated list of media items', async () => {
    const cleanupAuth = setupAdminAuthMock();
    const origList = mediaRepository.listMedia;

    mediaRepository.listMedia = async () => ({
      items: [
        {
          id: 'media_1',
          provider: 'imagekit',
          fileId: 'ik_1',
          fileName: 'img1.png',
          url: 'https://ik.imagekit.io/mock/img1.png',
          folder: 'portfolio/site',
          mimeType: 'image/png',
          fileSize: 500,
          displayOrder: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      total: 1,
      page: 1,
      limit: 20,
    });

    try {
      const res = await request(app)
        .get('/api/v1/admin/media')
        .set('Authorization', 'Bearer mock_admin_token');

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.items.length, 1);
      assert.equal(res.body.data.total, 1);
    } finally {
      mediaRepository.listMedia = origList;
      cleanupAuth();
    }
  });

  it('GET /api/v1/admin/media/:mediaId should return 404 for non-existent media', async () => {
    const cleanupAuth = setupAdminAuthMock();
    const origGet = mediaRepository.getMediaById;

    mediaRepository.getMediaById = async () => null;

    try {
      const res = await request(app)
        .get('/api/v1/admin/media/non_existent_id')
        .set('Authorization', 'Bearer mock_admin_token');

      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'RESOURCE_NOT_FOUND');
    } finally {
      mediaRepository.getMediaById = origGet;
      cleanupAuth();
    }
  });

  it('DELETE /api/v1/admin/media/:mediaId should delete file from ImageKit and Firestore record', async () => {
    const cleanupAuth = setupAdminAuthMock();
    const origGet = mediaRepository.getMediaById;
    const origDeleteIK = imagekitService.deleteFile;
    const origDeleteRepo = mediaRepository.deleteMediaRecord;

    let ikDeletedFileId = '';
    let repoDeletedMediaId = '';

    mediaRepository.getMediaById = async () => ({
      id: 'media_to_delete',
      provider: 'imagekit',
      fileId: 'ik_file_to_delete',
      fileName: 'delete_me.png',
      url: 'https://ik.imagekit.io/mock/delete_me.png',
      folder: 'portfolio/site',
      mimeType: 'image/png',
      fileSize: 2048,
      displayOrder: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    imagekitService.deleteFile = async (fileId) => {
      ikDeletedFileId = fileId;
    };

    mediaRepository.deleteMediaRecord = async (mediaId) => {
      repoDeletedMediaId = mediaId;
    };

    try {
      const res = await request(app)
        .delete('/api/v1/admin/media/media_to_delete')
        .set('Authorization', 'Bearer mock_admin_token');

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(ikDeletedFileId, 'ik_file_to_delete');
      assert.equal(repoDeletedMediaId, 'media_to_delete');
    } finally {
      mediaRepository.getMediaById = origGet;
      imagekitService.deleteFile = origDeleteIK;
      mediaRepository.deleteMediaRecord = origDeleteRepo;
      cleanupAuth();
    }
  });
});

describe('Media Service Rollback Logic Unit Tests', () => {
  it('uploadMedia should delete uploaded ImageKit binary asset if Firestore metadata persistence fails', async () => {
    const origUpload = imagekitService.uploadFile;
    const origDeleteIK = imagekitService.deleteFile;
    const origCreateRecord = mediaRepository.createMediaRecord;

    let deleteTriggeredWithFileId = '';

    imagekitService.uploadFile = async () => ({
      fileId: 'ik_orphan_123',
      name: 'orphan.png',
      url: 'https://ik.imagekit.io/mock/orphan.png',
      size: 1024,
      filePath: '/portfolio/site/orphan.png',
    });

    mediaRepository.createMediaRecord = async () => {
      throw new Error('Simulated Firestore write error');
    };

    imagekitService.deleteFile = async (fileId) => {
      deleteTriggeredWithFileId = fileId;
    };

    try {
      await mediaService.uploadMedia({
        fileBuffer: Buffer.from('fake image content'),
        originalName: 'orphan.png',
        mimeType: 'image/png',
        fileSize: 1024,
        mediaType: 'site',
      });
      assert.fail('Should have thrown AppError on metadata persistence failure');
    } catch (error) {
      assert.ok(error instanceof AppError);
      assert.equal(error.statusCode, 500);
      assert.equal(deleteTriggeredWithFileId, 'ik_orphan_123');
    } finally {
      imagekitService.uploadFile = origUpload;
      imagekitService.deleteFile = origDeleteIK;
      mediaRepository.createMediaRecord = origCreateRecord;
    }
  });
});
