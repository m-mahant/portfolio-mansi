import { Router } from 'express';
import { getAdminBlogPage, updateAdminBlogPage } from '../../controllers/blog-page.controller';

export const adminBlogPageRouter = Router();

adminBlogPageRouter.get('/', getAdminBlogPage);
adminBlogPageRouter.patch('/', updateAdminBlogPage);
