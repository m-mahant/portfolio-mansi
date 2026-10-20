import { Request, Response, NextFunction } from 'express';
import { adminArtworkService } from '../../services/admin/admin-artwork.service';
import { createArtworkSchema, updateArtworkSchema, adminArtworkListQuerySchema } from '../../validators/admin.validators';

// Controller for listing artworks with administrative filters and pagination (GET /api/v1/admin/artworks).
export async function getArtworks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = adminArtworkListQuerySchema.parse(req.query);
    const result = await adminArtworkService.getAllArtworks({
      status: query.status,
      category: query.category,
      page: query.page,
      limit: query.limit,
    });
    res.status(200).json({
      success: true,
      data: result.items,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / query.limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Controller for retrieving a single artwork document by ID (GET /api/v1/admin/artworks/:artworkId).
export async function getArtworkById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const artworkId = Array.isArray(req.params.artworkId) ? req.params.artworkId[0] : req.params.artworkId;
    const data = await adminArtworkService.getArtworkById(artworkId);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Controller for creating a new artwork document (POST /api/v1/admin/artworks).
export async function createArtwork(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedBody = createArtworkSchema.parse(req.body);
    const data = await adminArtworkService.createArtwork(validatedBody);
    res.status(201).json({
      success: true,
      data,
      message: 'Artwork document successfully created.',
    });
  } catch (error) {
    next(error);
  }
}

// Controller for updating an existing artwork document (PATCH /api/v1/admin/artworks/:artworkId).
export async function updateArtwork(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const artworkId = Array.isArray(req.params.artworkId) ? req.params.artworkId[0] : req.params.artworkId;
    const validatedBody = updateArtworkSchema.parse(req.body);
    const data = await adminArtworkService.updateArtwork(artworkId, validatedBody);
    res.status(200).json({
      success: true,
      data,
      message: 'Artwork document successfully updated.',
    });
  } catch (error) {
    next(error);
  }
}

// Controller for deleting an artwork document (DELETE /api/v1/admin/artworks/:artworkId).
export async function deleteArtwork(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const artworkId = Array.isArray(req.params.artworkId) ? req.params.artworkId[0] : req.params.artworkId;
    await adminArtworkService.deleteArtwork(artworkId);
    res.status(200).json({
      success: true,
      message: 'Artwork document successfully deleted.',
    });
  } catch (error) {
    next(error);
  }
}
