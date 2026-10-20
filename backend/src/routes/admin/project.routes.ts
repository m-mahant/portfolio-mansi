import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../../controllers/admin/admin-project.controller';

// Router for Projects admin operations (/api/v1/admin/projects).
export const adminProjectRouter = Router();

adminProjectRouter.get('/', getProjects);
adminProjectRouter.get('/:projectId', getProjectById);
adminProjectRouter.post('/', createProject);
adminProjectRouter.patch('/:projectId', updateProject);
adminProjectRouter.delete('/:projectId', deleteProject);
