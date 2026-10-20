import { Router } from 'express';
import {
  getArtworks,
  getArtworkById,
  createArtwork,
  updateArtwork,
  deleteArtwork,
} from '../../controllers/admin/admin-artwork.controller';

// Router for Artworks admin operations (/api/v1/admin/artworks).
export const adminArtworkRouter = Router();

adminArtworkRouter.get('/', getArtworks);
adminArtworkRouter.get('/:artworkId', getArtworkById);
adminArtworkRouter.post('/', createArtwork);
adminArtworkRouter.patch('/:artworkId', updateArtwork);
adminArtworkRouter.delete('/:artworkId', deleteArtwork);
