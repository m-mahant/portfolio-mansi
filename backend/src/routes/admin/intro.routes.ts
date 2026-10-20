import { Router } from 'express';
import { getAdminIntroPage, updateAdminIntroPage } from '../../controllers/intro-page.controller';

export const adminIntroRouter = Router();

adminIntroRouter.get('/', getAdminIntroPage);
adminIntroRouter.patch('/', updateAdminIntroPage);
