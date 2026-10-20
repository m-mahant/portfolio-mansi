import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../src/app';

describe('OpenAPI & Swagger Documentation Endpoints', () => {
  it('GET /api-docs/json should return OpenAPI 3.0 specification JSON object', async () => {
    const res = await request(app).get('/api-docs/json');
    assert.equal(res.status, 200);
    assert.equal(res.headers['content-type'], 'application/json; charset=utf-8');
    assert.equal(res.body.openapi, '3.0.0');
    assert.equal(res.body.info.title, 'Mansi Mahant API');
    assert.ok(res.body.paths['/api/v1/projects']);
    assert.ok(res.body.paths['/api/v1/admin/site']);
  });

  it('GET /api/v1/docs/json should return identical OpenAPI specification JSON', async () => {
    const res = await request(app).get('/api/v1/docs/json');
    assert.equal(res.status, 200);
    assert.equal(res.body.openapi, '3.0.0');
  });

  it('GET /api-docs/ should serve interactive Swagger UI page', async () => {
    const res = await request(app).get('/api-docs/');
    assert.equal(res.status, 200);
    assert.match(res.text, /swagger-ui/i);
  });
});
