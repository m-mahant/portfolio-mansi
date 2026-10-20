import { Request, Response, NextFunction } from 'express';
import { mediaService, MediaService } from '../services/media.service';
import { AppError } from '../errors/app-error';

export class AdminMediaController {
  private service: MediaService;

  constructor(service: MediaService = mediaService) {
    this.service = service;
  }

  // POST /api/v1/admin/media/upload
  uploadMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        throw AppError.badRequest('No media file attached to upload request.');
      }

      const mediaRecord = await this.service.uploadMedia({
        fileBuffer: req.file.buffer,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        mediaType: req.body.mediaType,
        slug: req.body.slug,
        sectionContext: req.body.sectionContext,
        altText: req.body.altText,
        caption: req.body.caption,
        displayOrder: req.body.displayOrder ? Number(req.body.displayOrder) : undefined,
      });

      res.status(201).json({
        success: true,
        data: mediaRecord,
        message: 'Media asset successfully uploaded and recorded.',
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/v1/admin/media
  listMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.listMedia(req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/v1/admin/media/:mediaId
  getMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const mediaId = Array.isArray(req.params.mediaId) ? req.params.mediaId[0] : req.params.mediaId;
      const mediaRecord = await this.service.getMedia(mediaId);
      res.status(200).json({
        success: true,
        data: mediaRecord,
      });
    } catch (error) {
      next(error);
    }
  };

  // PATCH /api/v1/admin/media/:mediaId
  updateMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const mediaId = Array.isArray(req.params.mediaId) ? req.params.mediaId[0] : req.params.mediaId;
      const updatedRecord = await this.service.updateMediaMetadata(mediaId, req.body);
      res.status(200).json({
        success: true,
        data: updatedRecord,
        message: 'Media metadata successfully updated.',
      });
    } catch (error) {
      next(error);
    }
  };

  // DELETE /api/v1/admin/media/:mediaId
  deleteMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const mediaId = Array.isArray(req.params.mediaId) ? req.params.mediaId[0] : req.params.mediaId;
      await this.service.deleteMedia(mediaId);
      res.status(200).json({
        success: true,
        message: 'Media asset and metadata successfully deleted.',
      });
    } catch (error) {
      next(error);
    }
  };
}

export const adminMediaController = new AdminMediaController();
