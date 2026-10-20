import { artworkRepository, ArtworkListResult } from '../../repositories/artwork.repository';
import { Artwork, PublishStatus } from '../../types/database.types';
import { AppError } from '../../errors/app-error';
import { normalizeSlug, computeArtworkSections } from '../../validators/database.validators';
import { validateArtworkForPublishing } from '../../validators/admin.validators';

// Service orchestrating administrative artwork management, slug checks, publishing lifecycles, and section availability.
export class AdminArtworkService {
  // Retrieves paginated list of artworks including drafts and archived items.
  async getAllArtworks(query: {
    status?: PublishStatus;
    category?: string;
    page: number;
    limit: number;
  }): Promise<ArtworkListResult> {
    return artworkRepository.getAllArtworksAdmin(query);
  }

  // Fetches a single artwork by document ID or throws 404 NOT_FOUND.
  async getArtworkById(id: string): Promise<Artwork> {
    const artwork = await artworkRepository.getArtworkById(id);
    if (!artwork) {
      throw AppError.notFound(`Artwork with ID '${id}' not found.`);
    }
    return artwork;
  }

  // Creates a new artwork entry with slug normalization, duplicate detection, publish validation, and section availability computation.
  async createArtwork(data: Partial<Omit<Artwork, 'id' | 'createdAt' | 'updatedAt' | 'sections'>> & { title: string; category: string }): Promise<Artwork> {
    const rawSlug = data.slug || data.title;
    const slug = normalizeSlug(rawSlug);

    if (!slug) {
      throw AppError.badRequest('A valid title or slug must be provided.');
    }

    const existingWithSlug = await artworkRepository.getArtworkBySlug(slug);
    if (existingWithSlug) {
      throw AppError.conflict(`An artwork with slug '${slug}' already exists.`);
    }

    const status: PublishStatus = data.status || 'draft';
    const artworkPayload = {
      ...data,
      slug,
      status,
      displayOrder: data.displayOrder ?? 0,
      tags: data.tags || [],
      materials: data.materials || [],
      images: data.images || [],
    };

    if (status === 'published') {
      validateArtworkForPublishing(artworkPayload as unknown as Record<string, unknown>);
    }

    const sections = computeArtworkSections(artworkPayload);

    return artworkRepository.createArtwork({
      ...artworkPayload,
      sections,
    });
  }

  // Updates an existing artwork with partial fields, slug verification, publish validation, and section recalculation.
  async updateArtwork(id: string, updates: Partial<Artwork>): Promise<Artwork> {
    const existing = await artworkRepository.getArtworkById(id);
    if (!existing) {
      throw AppError.notFound(`Artwork with ID '${id}' not found.`);
    }

    let slug = existing.slug;
    if (updates.slug || updates.title) {
      const rawSlug = updates.slug || updates.title || existing.title;
      const newSlug = normalizeSlug(rawSlug);

      if (!newSlug) {
        throw AppError.badRequest('A valid title or slug must be provided.');
      }

      if (newSlug !== existing.slug) {
        const existingWithSlug = await artworkRepository.getArtworkBySlug(newSlug);
        if (existingWithSlug && existingWithSlug.id !== id) {
          throw AppError.conflict(`An artwork with slug '${newSlug}' already exists.`);
        }
        slug = newSlug;
      }
    }

    const mergedArtwork: Artwork = {
      ...existing,
      ...updates,
      slug,
      updatedAt: new Date().toISOString(),
    };

    if (mergedArtwork.status === 'published') {
      validateArtworkForPublishing(mergedArtwork as unknown as Record<string, unknown>);
    }

    const sections = computeArtworkSections(mergedArtwork);
    mergedArtwork.sections = sections;

    const updated = await artworkRepository.updateArtwork(id, {
      ...updates,
      slug,
      sections,
    });

    if (!updated) {
      throw AppError.notFound(`Artwork with ID '${id}' not found.`);
    }

    return updated;
  }

  // Deletes artwork metadata from Firestore.
  async deleteArtwork(id: string): Promise<void> {
    const deleted = await artworkRepository.deleteArtwork(id);
    if (!deleted) {
      throw AppError.notFound(`Artwork with ID '${id}' not found.`);
    }
  }
}

export const adminArtworkService = new AdminArtworkService();
