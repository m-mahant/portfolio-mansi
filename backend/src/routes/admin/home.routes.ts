import { Router } from 'express';
import { getAdminHomePage, updateAdminHomePage } from '../../controllers/home-page.controller';

export const adminHomeRouter = Router();

adminHomeRouter.get('/', getAdminHomePage);
adminHomeRouter.patch('/', updateAdminHomePage);
