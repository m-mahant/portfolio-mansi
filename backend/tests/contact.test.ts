import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import supertest from 'supertest';
import { app } from '../src/app';
import { resetContactRateLimiter } from '../src/middleware/rate-limit.middleware';

describe('Contact Submission API (POST /api/v1/contact)', () => {
  beforeEach(() => {
    resetContactRateLimiter();
  });

  it('should accept valid contact submission and return 201 Created', async () => {
    const response = await supertest(app)
      .post('/api/v1/contact')
      .send({
        name: 'Test Visitor',
        email: 'visitor@example.com',
        subject: 'Inquiry',
        message: 'Hello, I would like to discuss a project collaboration.',
      });

    assert.equal(response.status, 201);
    assert.equal(response.body.success, true);
    assert.equal(response.body.data.message, 'Message sent successfully.');
  });

  it('should sanitize HTML tags from name, subject, and message', async () => {
    const response = await supertest(app)
      .post('/api/v1/contact')
      .send({
        name: '<b>Hacker</b>',
        email: 'hacker@example.com',
        subject: '<script>alert("xss")</script>Subject',
        message: 'Hello <iframe src="evil.com"></iframe>world!',
      });

    assert.equal(response.status, 201);
    assert.equal(response.body.success, true);
  });

  it('should reject invalid email format with 400 Bad Request', async () => {
    const response = await supertest(app)
      .post('/api/v1/contact')
      .send({
        name: 'Test Visitor',
        email: 'invalid-email-string',
        subject: 'Inquiry',
        message: 'Test message content here.',
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
    assert.match(response.body.error.message, /email/i);
  });

  it('should reject missing required fields with 400 Bad Request', async () => {
    const response = await supertest(app)
      .post('/api/v1/contact')
      .send({
        name: 'Test Visitor',
        email: 'visitor@example.com',
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
  });

  it('should enforce rate limiting after 5 requests from same IP', async () => {
    for (let i = 0; i < 5; i++) {
      const res = await supertest(app)
        .post('/api/v1/contact')
        .send({
          name: `Visitor ${i}`,
          email: `visitor${i}@example.com`,
          subject: 'Testing Rate Limit',
          message: 'This is test request number ' + i,
        });
      assert.equal(res.status, 201);
    }

    // 6th request should fail with 429
    const blockedRes = await supertest(app)
      .post('/api/v1/contact')
      .send({
        name: 'Blocked Visitor',
        email: 'blocked@example.com',
        subject: 'Testing Rate Limit',
        message: 'Should be blocked.',
      });

    assert.equal(blockedRes.status, 429);
    assert.equal(blockedRes.body.success, false);
    assert.match(blockedRes.body.error.message, /too many contact submissions/i);
  });
});
