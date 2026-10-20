import { adminRepository } from '../repositories/admin.repository';

// Service for evaluating administrator access permissions.
export class AdminAuthService {
  // Verifies whether a given user UID corresponds to an active administrator account with admin role.
  async isUserActiveAdmin(uid: string): Promise<boolean> {
    const adminRecord = await adminRepository.getAdminByUid(uid);
    return adminRecord !== null && adminRecord.role === 'admin' && adminRecord.isActive === true;
  }
}

export const adminAuthService = new AdminAuthService();
