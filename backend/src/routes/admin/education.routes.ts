import { Router } from 'express';
import {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from '../../controllers/admin/admin-education.controller';

// Router for Education admin operations (/api/v1/admin/education).
export const adminEducationRouter = Router();

adminEducationRouter.get('/', getEducation);
adminEducationRouter.post('/', createEducation);
adminEducationRouter.patch('/:educationId', updateEducation);
adminEducationRouter.delete('/:educationId', deleteEducation);
