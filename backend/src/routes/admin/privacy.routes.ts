import { Router } from 'express';
import { getAdminPrivacyPage, updateAdminPrivacyPage } from '../../controllers/privacy-page.controller';

export const adminPrivacyRouter = Router();

adminPrivacyRouter.get('/', getAdminPrivacyPage);
adminPrivacyRouter.patch('/', updateAdminPrivacyPage);
