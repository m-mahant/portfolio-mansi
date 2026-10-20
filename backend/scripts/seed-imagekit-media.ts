import { deflateSync } from 'zlib';
import { initFirebaseAdmin, db } from '../src/config/firebase.config';
import { imagekitService } from '../src/services/imagekit.service';
import { mediaRepository } from '../src/repositories/media.repository';
import {
  getSiteMediaPath,
  getProfileMediaPath,
  getDevelopmentProjectMediaPath,
  getArtworkMediaPath,
  getBlogMediaPath,
} from '../src/validators/media.validators';
import { Media } from '../src/types/database.types';

// Standard CRC32 checksum required by every PNG chunk.
function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([length, typeBuf, data, crcBuf]);
}

// Builds a tiny solid-color PNG buffer to stand in for a real photo until it is replaced in Admin.
function makeDummyPng(width: number, height: number, rgb: [number, number, number]): Buffer {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type: truecolor RGB
  ihdrData[10] = 0; // compression method
  ihdrData[11] = 0; // filter method
  ihdrData[12] = 0; // interlace method

  const rowSize = 1 + width * 3;
  const raw = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * rowSize;
    raw[rowStart] = 0; // per-row filter byte: none
    for (let x = 0; x < width; x++) {
      const px = rowStart + 1 + x * 3;
      raw[px] = rgb[0];
      raw[px + 1] = rgb[1];
      raw[px + 2] = rgb[2];
    }
  }

  const idatData = deflateSync(raw);

  return Buffer.concat([
    signature,
    pngChunk('IHDR', ihdrData),
    pngChunk('IDAT', idatData),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

const PALETTE = {
  site: [148, 163, 184] as [number, number, number],
  profile: [99, 102, 241] as [number, number, number],
  development: [59, 130, 246] as [number, number, number],
  art: [236, 72, 153] as [number, number, number],
  blog: [34, 197, 94] as [number, number, number],
};

const DUMMY_WIDTH = 800;
const DUMMY_HEIGHT = 600;

interface UploadTarget {
  category: keyof typeof PALETTE;
  folder: string;
  fileName: string;
  altText: string;
}

// Uploads one generated dummy PNG to ImageKit and records it in the media collection.
async function uploadDummy(target: UploadTarget): Promise<Media> {
  const buffer = makeDummyPng(DUMMY_WIDTH, DUMMY_HEIGHT, PALETTE[target.category]);
  const uploadResult = await imagekitService.uploadFile({
    fileBuffer: buffer,
    fileName: target.fileName,
    folder: target.folder,
  });

  return mediaRepository.createMediaRecord({
    provider: 'imagekit',
    fileId: uploadResult.fileId,
    fileName: uploadResult.name,
    url: uploadResult.url,
    thumbnailUrl: uploadResult.thumbnailUrl,
    folder: target.folder,
    mimeType: 'image/png',
    fileSize: buffer.length,
    width: uploadResult.width ?? DUMMY_WIDTH,
    height: uploadResult.height ?? DUMMY_HEIGHT,
    altText: target.altText,
    storagePath: uploadResult.filePath,
  });
}

// Uploads real placeholder images to ImageKit (one per content item, folder-organized) and relinks
// every seeded Firestore document to the resulting CDN URLs instead of the fake placehold.co ones.
export async function seedImageKitMedia(): Promise<void> {
  console.log('Initializing Firebase Admin SDK...');
  initFirebaseAdmin();

  if (!db) {
    throw new Error('Firestore database instance is not initialized.');
  }

  const keepIds = new Set<string>();

  console.log('Uploading site logo + favicon...');
  const siteLogo = await uploadDummy({
    category: 'site',
    folder: getSiteMediaPath(),
    fileName: 'site-logo.png',
    altText: 'Mansi Mahant Logo',
  });
  const siteFavicon = await uploadDummy({
    category: 'site',
    folder: getSiteMediaPath(),
    fileName: 'site-favicon.png',
    altText: 'Favicon',
  });
  keepIds.add(siteLogo.id);
  keepIds.add(siteFavicon.id);
  await db.collection('siteSettings').doc('general').update({
    'logo.mediaId': siteLogo.id,
    'logo.url': siteLogo.url,
    'logo.storagePath': siteLogo.storagePath,
    'favicon.mediaId': siteFavicon.id,
    'favicon.url': siteFavicon.url,
    'favicon.storagePath': siteFavicon.storagePath,
  });

  console.log('Uploading profile images...');
  const profileImg = await uploadDummy({
    category: 'profile',
    folder: getProfileMediaPath(),
    fileName: 'profile.png',
    altText: 'Mansi Mahant Portrait',
  });
  const secondaryImg = await uploadDummy({
    category: 'profile',
    folder: getProfileMediaPath(),
    fileName: 'studio.png',
    altText: 'Studio and Workspace',
  });
  keepIds.add(profileImg.id);
  keepIds.add(secondaryImg.id);
  await db.collection('about').doc('profile').update({
    'profileImage.mediaId': profileImg.id,
    'profileImage.url': profileImg.url,
    'secondaryImage.mediaId': secondaryImg.id,
    'secondaryImage.url': secondaryImg.url,
  });

  console.log('Uploading project images...');
  const projectsSnap = await db.collection('projects').get();
  for (const doc of projectsSnap.docs) {
    const project = doc.data() as Record<string, any>;
    const slug = project.slug as string;

    const cover = await uploadDummy({
      category: 'development',
      folder: getDevelopmentProjectMediaPath(slug, 'cover'),
      fileName: 'cover.png',
      altText: `${project.title} cover`,
    });
    keepIds.add(cover.id);

    const updates: Record<string, unknown> = {
      'coverImage.mediaId': cover.id,
      'coverImage.url': cover.url,
      'coverImage.width': cover.width,
      'coverImage.height': cover.height,
    };

    if (Array.isArray(project.gallery) && project.gallery.length > 0) {
      const galleryUploads = [];
      for (let i = 0; i < project.gallery.length; i++) {
        const g = await uploadDummy({
          category: 'development',
          folder: getDevelopmentProjectMediaPath(slug, 'gallery'),
          fileName: `gallery-${i + 1}.png`,
          altText: project.gallery[i].altText || `${project.title} gallery image`,
        });
        keepIds.add(g.id);
        galleryUploads.push({
          mediaId: g.id,
          url: g.url,
          altText: project.gallery[i].altText,
          displayOrder: i + 1,
        });
      }
      updates.gallery = galleryUploads;
    }

    if (project.architecture?.enabled && project.architecture?.diagramUrl) {
      const diagram = await uploadDummy({
        category: 'development',
        folder: getDevelopmentProjectMediaPath(slug, 'architecture'),
        fileName: 'architecture-diagram.png',
        altText: `${project.title} architecture diagram`,
      });
      keepIds.add(diagram.id);
      updates['architecture.diagramUrl'] = diagram.url;
    }

    await doc.ref.update(updates);
  }

  console.log('Uploading artwork images...');
  const artworksSnap = await db.collection('artworks').get();
  for (const doc of artworksSnap.docs) {
    const artwork = doc.data() as Record<string, any>;
    const slug = artwork.slug as string;

    const featured = await uploadDummy({
      category: 'art',
      folder: getArtworkMediaPath(slug, 'featured'),
      fileName: 'featured.png',
      altText: `${artwork.title} featured image`,
    });
    keepIds.add(featured.id);

    const updates: Record<string, unknown> = {
      'featuredImage.mediaId': featured.id,
      'featuredImage.url': featured.url,
      'featuredImage.width': featured.width,
      'featuredImage.height': featured.height,
    };

    if (Array.isArray(artwork.images) && artwork.images.length > 0) {
      const imageUploads = [];
      for (let i = 0; i < artwork.images.length; i++) {
        const g = await uploadDummy({
          category: 'art',
          folder: getArtworkMediaPath(slug, 'gallery'),
          fileName: `gallery-${i + 1}.png`,
          altText: artwork.images[i].altText || `${artwork.title} gallery image`,
        });
        keepIds.add(g.id);
        imageUploads.push({
          mediaId: g.id,
          url: g.url,
          altText: artwork.images[i].altText,
          displayOrder: i + 1,
        });
      }
      updates.images = imageUploads;
    }

    await doc.ref.update(updates);
  }

  console.log('Uploading blog cover images...');
  const blogsSnap = await db.collection('blogs').get();
  for (const doc of blogsSnap.docs) {
    const blog = doc.data() as Record<string, any>;
    const slug = blog.slug as string;

    const cover = await uploadDummy({
      category: 'blog',
      folder: getBlogMediaPath(slug),
      fileName: 'cover.png',
      altText: `${blog.title} cover`,
    });
    keepIds.add(cover.id);

    await doc.ref.update({
      'featuredImage.mediaId': cover.id,
      'featuredImage.url': cover.url,
    });
  }

  console.log('Removing the old fake placehold.co media records...');
  const mediaSnap = await db.collection('media').get();
  let deleted = 0;
  for (const doc of mediaSnap.docs) {
    if (!keepIds.has(doc.id)) {
      await doc.ref.delete();
      deleted += 1;
    }
  }
  console.log(`Deleted ${deleted} fake media record(s) that never existed on ImageKit.`);

  console.log('Uploaded real dummy images to ImageKit and relinked all Firestore content.');
}

// Execute script if run directly.
if (require.main === module) {
  seedImageKitMedia()
    .then(() => {
      console.log('ImageKit dummy media seeding complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('ImageKit dummy media seeding failed:', err);
      process.exit(1);
    });
}
