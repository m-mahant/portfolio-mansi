import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../src/app';
import { computeProjectSections, computeArtworkSections } from '../src/validators/database.validators';
import { Project, Artwork } from '../src/types/database.types';

describe('Public API Endpoints (/api/v1)', () => {
  it('GET /api/v1/health should return status 200 OK', async () => {
    const res = await request(app).get('/api/v1/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.status, 'ok');
  });

  it('GET /api/v1/site should return public site settings without sensitive data', async () => {
    const res = await request(app).get('/api/v1/site');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.siteName);
    assert.ok(res.body.data.siteTitle);
    assert.equal(res.body.data.apiKey, undefined);
    assert.equal(res.body.data.privateKey, undefined);
  });

  it('GET /api/v1/about should return public about profile', async () => {
    const res = await request(app).get('/api/v1/about');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.introduction);
    assert.ok(Array.isArray(res.body.data.whatIDo));
  });

  it('GET /api/v1/social-links should return array of visible social links', async () => {
    const res = await request(app).get('/api/v1/social-links');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  it('GET /api/v1/projects should return paginated project response', async () => {
    const res = await request(app).get('/api/v1/projects?page=1&limit=12');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data.items));
    assert.ok(res.body.data.pagination);
    assert.equal(res.body.data.pagination.page, 1);
    assert.equal(res.body.data.pagination.limit, 12);
  });

  it('GET /api/v1/projects/:slug should return 404 for non-existent slug', async () => {
    const res = await request(app).get('/api/v1/projects/non-existent-project-slug');
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'RESOURCE_NOT_FOUND');
  });

  it('GET /api/v1/artworks should return paginated artwork response', async () => {
    const res = await request(app).get('/api/v1/artworks?page=1&limit=12');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data.items));
    assert.ok(res.body.data.pagination);
  });

  it('GET /api/v1/artworks/:slug should return 404 for non-existent slug', async () => {
    const res = await request(app).get('/api/v1/artworks/non-existent-artwork-slug');
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'RESOURCE_NOT_FOUND');
  });

  it('GET /api/v1/experience should return visible experience entries', async () => {
    const res = await request(app).get('/api/v1/experience');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  it('GET /api/v1/education should return visible education entries', async () => {
    const res = await request(app).get('/api/v1/education');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  it('GET /api/v1/theme should return active dynamic theme settings', async () => {
    const res = await request(app).get('/api/v1/theme');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.colors);
    assert.ok(res.body.data.fonts);
    assert.ok(res.body.data.styles);
  });

  it('GET /api/v1/unknown-endpoint should return 404 NOT_FOUND error', async () => {
    const res = await request(app).get('/api/v1/unknown-endpoint');
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'NOT_FOUND');
  });
});

describe('Hide Empty Sections Engine Unit Tests', () => {
  it('should compute project section availability based on explicit enablement & content', () => {
    const mockProject: Partial<Project> = {
      overview: 'Project Overview content',
      problem: 'Problem statement narrative',
      architecture: {
        enabled: true,
        description: 'Microservices architecture',
        endpoints: [],
      },
      workflow: {
        enabled: false,
        steps: [],
      },
    };

    const sections = computeProjectSections(mockProject as Project);
    assert.equal(sections.overview, true);
    assert.equal(sections.problem, true);
    assert.equal(sections.architecture, true);
    assert.equal(sections.workflow, false);
    assert.equal(sections.apiFlow, false);
    assert.equal(sections.performance, false);
  });

  it('should compute artwork section availability correctly', () => {
    const mockArtwork: Partial<Artwork> = {
      description: 'Ethereal canvas artwork',
      inspiration: 'Cyberpunk aesthetic',
      materials: ['Shader', 'Canvas'],
      images: [],
    };

    const sections = computeArtworkSections(mockArtwork as Artwork);
    assert.equal(sections.description, true);
    assert.equal(sections.inspiration, true);
    assert.equal(sections.materials, true);
    assert.equal(sections.dimensions, false);
    assert.equal(sections.process, false);
    assert.equal(sections.gallery, false);
  });
});
