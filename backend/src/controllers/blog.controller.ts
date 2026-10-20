import { Request, Response, NextFunction } from 'express';
import { blogService } from '../services/blog.service';
import { blogQuerySchema, createBlogSchema, updateBlogSchema } from '../validators/blog.validators';
import { ApiResponse } from '../types';
import { Blog } from '../types/database.types';

// Public GET /api/v1/blogs - List published blog posts
export async function getPublicBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = blogQuerySchema.parse(req.query);
    const data = await blogService.getPublicBlogs(query);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Public GET /api/v1/blogs/:slug - Get published blog post by slug
export async function getPublicBlogBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const slug = req.params.slug as string;
    const data = await blogService.getPublicBlogBySlug(slug);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Admin GET /api/v1/admin/blogs - List all blog posts (draft, published, archived)
export async function getAdminBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = blogQuerySchema.parse(req.query);
    const data = await blogService.getAdminBlogs(query);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Admin GET /api/v1/admin/blogs/:id - Get blog post details by ID
export async function getAdminBlogById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const data = await blogService.getBlogById(id);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Admin POST /api/v1/admin/blogs - Create new blog post
export async function createBlog(req: Request, res: Response<ApiResponse<Blog>>, next: NextFunction): Promise<void> {
  try {
    const input = createBlogSchema.parse(req.body);
    const data = await blogService.createBlog(input);
    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Admin PATCH /api/v1/admin/blogs/:id - Update blog post
export async function updateBlog(req: Request, res: Response<ApiResponse<Blog>>, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const input = updateBlogSchema.parse(req.body);
    const data = await blogService.updateBlog(id, input);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Admin DELETE /api/v1/admin/blogs/:id - Delete blog post
export async function deleteBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    await blogService.deleteBlog(id);
    res.status(200).json({
      success: true,
      data: { message: `Blog ${id} deleted successfully` },
    });
  } catch (error) {
    next(error);
  }
}
