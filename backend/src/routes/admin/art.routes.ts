import { Router } from 'express';
import { getAdminArtPage, updateAdminArtPage } from '../../controllers/art-page.controller';

export const adminArtRouter = Router();

adminArtRouter.get('/', getAdminArtPage);
adminArtRouter.patch('/', updateAdminArtPage);
