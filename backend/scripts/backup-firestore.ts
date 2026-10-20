import fs from 'node:fs';
import path from 'node:path';
import { initFirebaseAdmin, db } from '../src/config/firebase.config';

// Single-document collections: collectionName -> fixed docId.
const SINGLETON_DOCS: Record<string, string> = {
  siteSettings: 'general',
  about: 'profile',
  introPage: 'config',
  homePage: 'config',
  workPage: 'config',
  developmentPage: 'config',
  artPage: 'config',
  blogPage: 'config',
  experiencePage: 'config',
  contactPage: 'config',
  themeSettings: 'active',
};

// Multi-document collections backed up in full.
const COLLECTIONS = [
  'socialLinks',
  'projects',
  'artworks',
  'experiences',
  'education',
  'media',
  'blogs',
  'admins',
  'contactMessages',
];

// Exports every known Firestore collection to timestamped JSON files for disaster recovery.
export async function backupFirestore(): Promise<void> {
  console.log('Initializing Firebase Admin SDK...');
  initFirebaseAdmin();

  if (!db) {
    throw new Error('Firestore database instance is not initialized.');
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outDir = path.resolve(process.cwd(), 'backups', timestamp);
  fs.mkdirSync(outDir, { recursive: true });

  for (const [collectionName, docId] of Object.entries(SINGLETON_DOCS)) {
    const snap = await db.collection(collectionName).doc(docId).get();
    const data = snap.exists ? { id: snap.id, ...snap.data() } : null;
    fs.writeFileSync(path.join(outDir, `${collectionName}.json`), JSON.stringify(data, null, 2));
    console.log(`Backed up ${collectionName}/${docId}`);
  }

  for (const collectionName of COLLECTIONS) {
    const snap = await db.collection(collectionName).get();
    const docs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    fs.writeFileSync(path.join(outDir, `${collectionName}.json`), JSON.stringify(docs, null, 2));
    console.log(`Backed up ${collectionName} (${docs.length} document(s))`);
  }

  console.log(`\nBackup complete: ${outDir}`);
}

// Execute script if run directly.
if (require.main === module) {
  backupFirestore()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Firestore backup failed:', err);
      process.exit(1);
    });
}
