import { Router } from 'express';
import { getAdminDevelopmentPage, updateAdminDevelopmentPage } from '../../controllers/development-page.controller';

export const adminDevelopmentRouter = Router();

adminDevelopmentRouter.get('/', getAdminDevelopmentPage);
adminDevelopmentRouter.patch('/', updateAdminDevelopmentPage);
