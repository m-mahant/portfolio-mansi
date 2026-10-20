import { Router } from 'express';
import { getThemeSettings, updateThemeSettings } from '../../controllers/admin/admin-theme.controller';

// Router for Theme Settings admin operations (/api/v1/admin/theme).
export const adminThemeRouter = Router();

adminThemeRouter.get('/', getThemeSettings);
adminThemeRouter.patch('/', updateThemeSettings);
