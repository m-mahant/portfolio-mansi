import { Router } from 'express';
import {
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
} from '../../controllers/admin/admin-social.controller';

// Router for Social Links admin operations (/api/v1/admin/social-links).
export const adminSocialRouter = Router();

adminSocialRouter.get('/', getSocialLinks);
adminSocialRouter.post('/', createSocialLink);
adminSocialRouter.patch('/:socialId', updateSocialLink);
adminSocialRouter.delete('/:socialId', deleteSocialLink);
