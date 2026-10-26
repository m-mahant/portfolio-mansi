import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../src/app';

describe('Real Firebase Content Integration Tests', () => {
  it('GET /api/v1/site should return populated site settings from Firestore', async () => {
    const res = await request(app).get('/api/v1/site');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(typeof res.body.data.siteName, 'string');
    assert.ok(res.body.data.siteName.length > 0);
    assert.equal(typeof res.body.data.siteTitle, 'string');
    assert.equal(res.body.data.email, undefined);
  });

  it('GET /api/v1/about should return populated about profile from Firestore', async () => {
    const res = await request(app).get('/api/v1/about');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(typeof res.body.data.introduction, 'string');
    assert.equal(typeof res.body.data.developerSide, 'string');
    assert.equal(typeof res.body.data.artistSide, 'string');
  });

  it('GET /api/v1/social-links should return 3 visible social links from Firestore', async () => {
    const res = await request(app).get('/api/v1/social-links');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(Array.isArray(res.body.data), true);
    assert.equal(res.body.data.length, 3);
  });

  it('GET /api/v1/projects should return at least 4 published projects from Firestore', async () => {
    const res = await request(app).get('/api/v1/projects?limit=50');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(Array.isArray(res.body.data.items), true);
    assert.ok(res.body.data.items.length >= 4, `Expected >= 4 projects, received ${res.body.data.items.length}`);
  });

  it('GET /api/v1/projects/:slug should return individual project detail', async () => {
    const list = await request(app).get('/api/v1/projects?limit=1');
    assert.equal(list.status, 200);
    const slug = list.body.data.items[0]?.slug;
    assert.equal(typeof slug, 'string');
    const res = await request(app).get(`/api/v1/projects/${slug}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.slug, slug);
  });

  it('GET /api/v1/artworks should return a valid paginated response from Firestore', async () => {
    const res = await request(app).get('/api/v1/artworks?limit=50');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(Array.isArray(res.body.data.items), true);
    // Real artworks are currently drafts pending cover images, so the published count is
    // legitimately 0 right now — this just checks the endpoint itself works against real data.
  });

  it('GET /api/v1/artworks/:slug should return individual artwork detail when one is published', async () => {
    const list = await request(app).get('/api/v1/artworks?limit=1');
    assert.equal(list.status, 200);
    const slug = list.body.data.items[0]?.slug;
    if (!slug) return; // No published artworks yet — nothing to fetch a detail page for.
    const res = await request(app).get(`/api/v1/artworks/${slug}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.slug, slug);
  });

  it('GET /api/v1/experience should return at least 5 visible experience entries from Firestore', async () => {
    const res = await request(app).get('/api/v1/experience');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(Array.isArray(res.body.data), true);
    assert.ok(res.body.data.length >= 5, `Expected >= 5 experiences, received ${res.body.data.length}`);
  });

  it('GET /api/v1/education should return at least 2 visible education entries from Firestore', async () => {
    const res = await request(app).get('/api/v1/education');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(Array.isArray(res.body.data), true);
    assert.ok(res.body.data.length >= 2, `Expected >= 2 education entries, received ${res.body.data.length}`);
  });

  it('GET /api/v1/theme should return active dynamic theme settings from Firestore', async () => {
    const res = await request(app).get('/api/v1/theme');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(typeof res.body.data.colors.primary, 'string');
    assert.equal(typeof res.body.data.fonts.bodyFont, 'string');
  });
});
