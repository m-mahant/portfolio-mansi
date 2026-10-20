import { db } from '../config/firebase.config';

// Interface defining the structure of an admin authorization document in Firestore (admins/{uid}).
export interface AdminRecord {
  uid: string;
  email?: string;
  role: 'admin' | string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Repository for querying admin authorization documents in Firestore.
export class AdminRepository {
  private readonly collectionName = 'admins';

  // Fetches admin record by Firebase UID from admins collection.
  async getAdminByUid(uid: string): Promise<AdminRecord | null> {
    if (!db) {
      return null;
    }

    try {
      const docRef = db.collection(this.collectionName).doc(uid);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return null;
      }

      const data = docSnap.data();
      return {
        uid: docSnap.id,
        email: data?.email,
        role: data?.role ?? 'admin',
        isActive: Boolean(data?.isActive),
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt,
      };
    } catch {
      return null;
    }
  }

  // Creates or updates an administrator authorization record in Firestore under admins/{uid}.
  async upsertAdmin(data: { uid: string; email: string; role?: string; isActive?: boolean }): Promise<AdminRecord> {
    if (!db) {
      throw new Error('Firestore DB instance is not initialized.');
    }

    const docRef = db.collection(this.collectionName).doc(data.uid);
    const docSnap = await docRef.get();
    const now = new Date().toISOString();

    if (!docSnap.exists) {
      const newRecord: AdminRecord = {
        uid: data.uid,
        email: data.email,
        role: data.role ?? 'admin',
        isActive: data.isActive ?? true,
        createdAt: now,
        updatedAt: now,
      };
      await docRef.set(newRecord);
      return newRecord;
    } else {
      const existing = docSnap.data();
      const updateData: Partial<AdminRecord> = {
        email: data.email,
        role: data.role ?? existing?.role ?? 'admin',
        isActive: data.isActive ?? true,
        updatedAt: now,
      };
      if (!existing?.createdAt) {
        updateData.createdAt = now;
      }
      await docRef.update(updateData);
      return {
        uid: data.uid,
        email: data.email,
        role: (updateData.role as string) ?? 'admin',
        isActive: updateData.isActive ?? true,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
      };
    }
  }
}

export const adminRepository = new AdminRepository();
