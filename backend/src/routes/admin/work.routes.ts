import { Router } from 'express';
import { getAdminWorkPage, updateAdminWorkPage } from '../../controllers/work-page.controller';

export const adminWorkRouter = Router();

adminWorkRouter.get('/', getAdminWorkPage);
adminWorkRouter.patch('/', updateAdminWorkPage);
