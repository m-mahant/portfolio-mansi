import { Request, Response, NextFunction } from 'express';
import { socialLinkService } from '../services/social-link.service';
import { ApiResponse } from '../types';
import { SocialLink } from '../types/database.types';

// Controller for handling public social links endpoint (GET /api/v1/social-links).
export async function getSocialLinks(
  _req: Request,
  res: Response<ApiResponse<SocialLink[]>>,
  next: NextFunction
): Promise<void> {
  try {
    const data = await socialLinkService.getPublicSocialLinks();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}
