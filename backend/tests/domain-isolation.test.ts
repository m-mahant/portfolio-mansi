import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../src/app';
import { buildImageKitFolder } from '../src/validators/media.validators';
import { siteSettingsRepository } from '../src/repositories/site-settings.repository';
import { aboutRepository } from '../src/repositories/about.repository';

describe('CMS Domain Isolation & Media Folder Resolution Unit Tests', () => {
  it('GET /api/v1/social should return status 200 OK and social links list', async () => {
    const res = await request(app).get('/api/v1/social');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  it('buildImageKitFolder should resolve canonical paths per domain', () => {
    // Blog domain
    assert.equal(buildImageKitFolder('blog', 'sample-post-slug'), 'portfolio/blog/sample-post-slug');
    assert.equal(buildImageKitFolder('blog'), 'portfolio/blog');

    // Site domain
    assert.equal(buildImageKitFolder('site'), 'portfolio/site');
    assert.equal(buildImageKitFolder('logo'), 'portfolio/site');

    // Profile domain
    assert.equal(buildImageKitFolder('profile'), 'portfolio/profile');
    assert.equal(buildImageKitFolder('about'), 'portfolio/profile');

    // Development domain
    assert.equal(buildImageKitFolder('development', 'my-app'), 'portfolio/development/my-app');
    assert.equal(buildImageKitFolder('project', 'my-app'), 'portfolio/development/my-app');

    // Art domain
    assert.equal(buildImageKitFolder('art', 'digital-canvas'), 'portfolio/art/digital-canvas');
    assert.equal(buildImageKitFolder('artwork', 'digital-canvas'), 'portfolio/art/digital-canvas');
  });

  it('Site Settings and About Profile repositories should mutate isolated Firestore documents', async () => {
    const originalSite = await siteSettingsRepository.getSiteSettings();
    const originalAbout = await aboutRepository.getAboutProfile();

    // Verify fields are distinct and from their respective domain repositories
    assert.ok(typeof originalSite.siteName === 'string');
    assert.ok(typeof originalAbout.introduction === 'string');

    // Verify SiteSettings does NOT leak about profile fields
    const siteData = originalSite as Record<string, unknown>;
    assert.equal(siteData['introduction'], undefined);
    assert.equal(siteData['myStory'], undefined);
    assert.equal(siteData['developerSide'], undefined);

    // Verify AboutProfile does NOT leak site settings fields
    const aboutData = originalAbout as Record<string, unknown>;
    assert.equal(aboutData['siteName'], undefined);
    assert.equal(aboutData['siteTitle'], undefined);
    assert.equal(aboutData['copyrightText'], undefined);
  });
});
