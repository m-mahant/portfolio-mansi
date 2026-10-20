import { Router } from 'express';
import { getAboutProfile, updateAboutProfile } from '../../controllers/admin/admin-about.controller';

// Router for About Profile admin operations (/api/v1/admin/about).
export const adminAboutRouter = Router();

adminAboutRouter.get('/', getAboutProfile);
adminAboutRouter.patch('/', updateAboutProfile);
