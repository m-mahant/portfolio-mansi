import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../src/app';
import { setCustomTokenVerifier } from '../src/utils/auth.utils';
import { adminRepository } from '../src/repositories/admin.repository';
import { adminAuthService } from '../src/services/admin-auth.service';

describe('Admin Authentication & Authorization (/api/v1/admin)', () => {
  it('GET /api/v1/admin/auth-check should return 401 UNAUTHORIZED when no token is provided', async () => {
    const res = await request(app).get('/api/v1/admin/auth-check');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'UNAUTHORIZED');
    assert.equal(res.body.error.message, 'Authentication token is required.');
  });

  it('GET /api/v1/admin/auth-check should return 401 UNAUTHORIZED for invalid Bearer format', async () => {
    const res = await request(app)
      .get('/api/v1/admin/auth-check')
      .set('Authorization', 'Basic invalidtoken');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'UNAUTHORIZED');
  });

  it('GET /api/v1/admin/auth-check should return 401 UNAUTHORIZED for invalid or expired ID token', async () => {
    setCustomTokenVerifier(null);
    const res = await request(app)
      .get('/api/v1/admin/auth-check')
      .set('Authorization', 'Bearer invalid_firebase_id_token_123');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'UNAUTHORIZED');
  });

  it('GET /api/v1/admin/auth-check should return 403 FORBIDDEN for authenticated non-admin user', async () => {
    const originalGetAdmin = adminRepository.getAdminByUid;

    setCustomTokenVerifier(async () => ({
      uid: 'non_admin_uid_123',
      email: 'user@example.com',
      email_verified: true,
      auth_time: Date.now(),
      iss: '',
      sub: 'non_admin_uid_123',
      aud: '',
      exp: Date.now() + 3600,
      firebase: { identities: {}, sign_in_provider: 'password' },
    }));

    (adminRepository as { getAdminByUid: typeof originalGetAdmin }).getAdminByUid = async () => null;

    try {
      const res = await request(app)
        .get('/api/v1/admin/auth-check')
        .set('Authorization', 'Bearer valid_mock_token');
      assert.equal(res.status, 403);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'FORBIDDEN');
      assert.equal(res.body.error.message, 'Administrator access is required.');
    } finally {
      setCustomTokenVerifier(null);
      (adminRepository as { getAdminByUid: typeof originalGetAdmin }).getAdminByUid = originalGetAdmin;
    }
  });

  it('GET /api/v1/admin/auth-check should return 403 FORBIDDEN for inactive admin user', async () => {
    const originalGetAdmin = adminRepository.getAdminByUid;

    setCustomTokenVerifier(async () => ({
      uid: 'inactive_admin_uid_456',
      email: 'inactive@example.com',
      email_verified: true,
      auth_time: Date.now(),
      iss: '',
      sub: 'inactive_admin_uid_456',
      aud: '',
      exp: Date.now() + 3600,
      firebase: { identities: {}, sign_in_provider: 'password' },
    }));

    (adminRepository as { getAdminByUid: typeof originalGetAdmin }).getAdminByUid = async () => ({
      uid: 'inactive_admin_uid_456',
      role: 'admin',
      isActive: false,
    });

    try {
      const res = await request(app)
        .get('/api/v1/admin/auth-check')
        .set('Authorization', 'Bearer valid_mock_token');
      assert.equal(res.status, 403);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'FORBIDDEN');
    } finally {
      setCustomTokenVerifier(null);
      (adminRepository as { getAdminByUid: typeof originalGetAdmin }).getAdminByUid = originalGetAdmin;
    }
  });

  it('GET /api/v1/admin/auth-check should return 200 OK for valid active admin user', async () => {
    const originalGetAdmin = adminRepository.getAdminByUid;

    setCustomTokenVerifier(async () => ({
      uid: 'active_admin_uid_789',
      email: 'admin@example.com',
      email_verified: true,
      auth_time: Date.now(),
      iss: '',
      sub: 'active_admin_uid_789',
      aud: '',
      exp: Date.now() + 3600,
      firebase: { identities: {}, sign_in_provider: 'password' },
    }));

    (adminRepository as { getAdminByUid: typeof originalGetAdmin }).getAdminByUid = async () => ({
      uid: 'active_admin_uid_789',
      role: 'admin',
      isActive: true,
    });

    try {
      const res = await request(app)
        .get('/api/v1/admin/auth-check')
        .set('Authorization', 'Bearer valid_admin_mock_token');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.authenticated, true);
      assert.equal(res.body.data.authorized, true);
    } finally {
      setCustomTokenVerifier(null);
      (adminRepository as { getAdminByUid: typeof originalGetAdmin }).getAdminByUid = originalGetAdmin;
    }
  });

  it('Public endpoints should remain accessible without authentication headers', async () => {
    const resSite = await request(app).get('/api/v1/site');
    assert.equal(resSite.status, 200);

    const resProjects = await request(app).get('/api/v1/projects');
    assert.equal(resProjects.status, 200);
  });
});

describe('Admin Authorization Service Unit Tests', () => {
  it('should return false for unknown uid', async () => {
    const isAuth = await adminAuthService.isUserActiveAdmin('non_existent_uid');
    assert.equal(isAuth, false);
  });

  it('should return true for active admin uid', async () => {
    const originalGetAdmin = adminRepository.getAdminByUid;
    (adminRepository as { getAdminByUid: typeof originalGetAdmin }).getAdminByUid = async () => ({
      uid: 'test_admin_uid',
      role: 'admin',
      isActive: true,
    });
    try {
      const isAuth = await adminAuthService.isUserActiveAdmin('test_admin_uid');
      assert.equal(isAuth, true);
    } finally {
      (adminRepository as { getAdminByUid: typeof originalGetAdmin }).getAdminByUid = originalGetAdmin;
    }
  });

  it('should return false for inactive admin uid', async () => {
    const originalGetAdmin = adminRepository.getAdminByUid;
    (adminRepository as { getAdminByUid: typeof originalGetAdmin }).getAdminByUid = async () => ({
      uid: 'inactive_uid',
      role: 'admin',
      isActive: false,
    });
    try {
      const isAuth = await adminAuthService.isUserActiveAdmin('inactive_uid');
      assert.equal(isAuth, false);
    } finally {
      (adminRepository as { getAdminByUid: typeof originalGetAdmin }).getAdminByUid = originalGetAdmin;
    }
  });
});
