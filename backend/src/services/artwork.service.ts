import { artworkRepository } from '../repositories/artwork.repository';
import { Artwork } from '../types/database.types';
import { computeArtworkSections } from '../validators/database.validators';
import { AppError } from '../errors/app-error';

export interface PaginatedArtworksResponse {
  items: Artwork[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Service for managing digital/traditional artwork retrieval and section availability.
export class ArtworkService {
  async getPublicArtworks(options: {
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedArtworksResponse> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(50, Math.max(1, options.limit || 12));

    const { items, total } = await artworkRepository.getPublishedArtworks({
      category: options.category,
      page,
      limit,
    });

    const totalPages = Math.ceil(total / limit);

    const itemsWithSections = items.map((artwork) => ({
      ...artwork,
      sections: computeArtworkSections(artwork),
    }));

    return {
      items: itemsWithSections,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async getPublicArtworkBySlug(slug: string): Promise<Artwork> {
    const cleanSlug = slug.trim();
    if (!cleanSlug) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Artwork slug parameter is required.');
    }

    const artwork = await artworkRepository.getPublishedArtworkBySlug(cleanSlug);
    if (!artwork) {
      throw new AppError(
        404,
        'RESOURCE_NOT_FOUND',
        `Artwork with slug '${cleanSlug}' was not found or is not published.`
      );
    }

    const sections = computeArtworkSections(artwork);

    return {
      ...artwork,
      sections,
    };
  }
}

export const artworkService = new ArtworkService();
