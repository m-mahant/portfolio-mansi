import { Router } from 'express';
import { getSiteSettings, updateSiteSettings } from '../../controllers/admin/admin-site.controller';

// Router for Site Settings admin operations (/api/v1/admin/site).
export const adminSiteRouter = Router();

adminSiteRouter.get('/', getSiteSettings);
adminSiteRouter.patch('/', updateSiteSettings);
