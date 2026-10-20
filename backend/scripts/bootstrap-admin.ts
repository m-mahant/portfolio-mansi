import { initFirebaseAdmin, auth } from '../src/config/firebase.config';
import { env } from '../src/config/env.config';
import { adminRepository } from '../src/repositories/admin.repository';

// Idempotent script to bootstrap the administrator authorization document in Firestore (admins/{uid}).
export async function bootstrapAdmin(): Promise<void> {
  const email = env.bootstrapAdminEmail || process.env.BOOTSTRAP_ADMIN_EMAIL;

  if (!email) {
    console.error('ERROR: BOOTSTRAP_ADMIN_EMAIL environment variable is missing.');
    process.exit(1);
  }

  initFirebaseAdmin();

  if (!auth) {
    console.error('ERROR: Firebase Auth Admin SDK is not initialized.');
    process.exit(1);
  }

  try {
    const userRecord = await auth.getUserByEmail(email);
    const uid = userRecord.uid;

    const record = await adminRepository.upsertAdmin({
      uid,
      email: userRecord.email || email,
      role: 'admin',
      isActive: true,
    });

    console.log(`[BOOTSTRAP SUCCESS] Administrator record configured: admins/${record.uid} (email: ${email}, isActive: ${record.isActive})`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error during admin bootstrap';
    console.error(`ERROR: Failed to bootstrap administrator for email "${email}": ${msg}`);
    process.exit(1);
  }
}

// Execute script if run directly.
if (require.main === module) {
  bootstrapAdmin()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
