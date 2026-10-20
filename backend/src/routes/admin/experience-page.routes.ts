import { Router } from 'express';
import { getAdminExperiencePage, updateAdminExperiencePage } from '../../controllers/experience-page.controller';

export const adminExperiencePageRouter = Router();

adminExperiencePageRouter.get('/', getAdminExperiencePage);
adminExperiencePageRouter.patch('/', updateAdminExperiencePage);
