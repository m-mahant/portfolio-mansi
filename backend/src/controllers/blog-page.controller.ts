import { Request, Response, NextFunction } from 'express';
import { blogPageService } from '../services/blog-page.service';

// GET /api/v1/blog-page — public blog listing page chrome.
export async function getPublicBlogPage(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await blogPageService.getPublicConfig();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

// GET /api/v1/admin/blog-page — admin blog page config.
export async function getAdminBlogPage(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await blogPageService.getAdminConfig();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/v1/admin/blog-page — update blog page config.
export async function updateAdminBlogPage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await blogPageService.updateAdminConfig(req.body);
    res.status(200).json({
      success: true,
      data,
      message: 'Blog page configuration successfully updated.',
    });
  } catch (error) {
    next(error);
  }
}
