import { Router } from 'express';
import { getAdminContactPage, updateAdminContactPage } from '../../controllers/contact-page.controller';

export const adminContactRouter = Router();

adminContactRouter.get('/', getAdminContactPage);
adminContactRouter.patch('/', updateAdminContactPage);
