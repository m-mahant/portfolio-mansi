import { Router } from 'express';
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../../controllers/admin/admin-experience.controller';

// Router for Professional Experience admin operations (/api/v1/admin/experience).
export const adminExperienceRouter = Router();

adminExperienceRouter.get('/', getExperiences);
adminExperienceRouter.post('/', createExperience);
adminExperienceRouter.patch('/:experienceId', updateExperience);
adminExperienceRouter.delete('/:experienceId', deleteExperience);
