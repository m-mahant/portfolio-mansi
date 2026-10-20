import multer from 'multer';
import { Router } from 'express';
import { adminMediaController } from '../controllers/admin-media.controller';
import { ALLOWED_IMAGE_MIME_TYPES, MAX_UPLOAD_FILE_SIZE } from '../validators/media.validators';
import { AppError } from '../errors/app-error';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_UPLOAD_FILE_SIZE,
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype as (typeof ALLOWED_IMAGE_MIME_TYPES)[number])) {
      cb(null, true);
    } else {
      cb(AppError.badRequest(`Unsupported file format "${file.mimetype}". Allowed formats: ${ALLOWED_IMAGE_MIME_TYPES.join(', ')}`));
    }
  },
});

export const adminMediaRouter = Router();

// POST /api/v1/admin/media/upload
adminMediaRouter.post('/upload', upload.single('file'), adminMediaController.uploadMedia);

// GET /api/v1/admin/media
adminMediaRouter.get('/', adminMediaController.listMedia);

// GET /api/v1/admin/media/:mediaId
adminMediaRouter.get('/:mediaId', adminMediaController.getMedia);

// PATCH /api/v1/admin/media/:mediaId
adminMediaRouter.patch('/:mediaId', adminMediaController.updateMedia);

// DELETE /api/v1/admin/media/:mediaId
adminMediaRouter.delete('/:mediaId', adminMediaController.deleteMedia);
