import { Router } from 'express';
import {
  getAdminBlogs,
  getAdminBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../../controllers/blog.controller';

export const adminBlogRouter = Router();

// GET /api/v1/admin/blogs - List all blogs for admin
adminBlogRouter.get('/', getAdminBlogs);

// GET /api/v1/admin/blogs/:id - Get blog details by ID
adminBlogRouter.get('/:id', getAdminBlogById);

// POST /api/v1/admin/blogs - Create new blog post
adminBlogRouter.post('/', createBlog);

// PATCH /api/v1/admin/blogs/:id - Update blog post
adminBlogRouter.patch('/:id', updateBlog);

// DELETE /api/v1/admin/blogs/:id - Delete blog post
adminBlogRouter.delete('/:id', deleteBlog);
