import { Request, Response, NextFunction } from 'express';
import { artworkService, PaginatedArtworksResponse } from '../services/artwork.service';
import { ApiResponse } from '../types';
import { Artwork } from '../types/database.types';

// Controller for handling public artwork list endpoint (GET /api/v1/artworks).
export async function getArtworks(
  req: Request,
  res: Response<ApiResponse<PaginatedArtworksResponse>>,
  next: NextFunction
): Promise<void> {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const category = req.query.category ? (req.query.category as string) : undefined;

    const data = await artworkService.getPublicArtworks({
      category,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Controller for handling public artwork detail endpoint by slug (GET /api/v1/artworks/:slug).
export async function getArtworkBySlug(
  req: Request,
  res: Response<ApiResponse<Artwork>>,
  next: NextFunction
): Promise<void> {
  try {
    const rawSlug = req.params.slug;
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
    const data = await artworkService.getPublicArtworkBySlug(slug);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}
