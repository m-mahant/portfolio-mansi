import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeAdmin } from '../middleware/admin.middleware';
import { checkAdminAuth } from '../controllers/admin-auth.controller';
import { adminMediaRouter } from './admin-media.routes';
import { adminSiteRouter } from './admin/site.routes';
import { adminIntroRouter } from './admin/intro.routes';
import { adminHomeRouter } from './admin/home.routes';
import { adminWorkRouter } from './admin/work.routes';
import { adminDevelopmentRouter } from './admin/development.routes';
import { adminArtRouter } from './admin/art.routes';
import { adminBlogPageRouter } from './admin/blog-page.routes';
import { adminExperiencePageRouter } from './admin/experience-page.routes';
import { adminAboutRouter } from './admin/about.routes';
import { adminSocialRouter } from './admin/social.routes';
import { adminProjectRouter } from './admin/project.routes';
import { adminArtworkRouter } from './admin/artwork.routes';
import { adminExperienceRouter } from './admin/experience.routes';
import { adminEducationRouter } from './admin/education.routes';
import { adminContactRouter } from './admin/contact.routes';
import { adminThemeRouter } from './admin/theme.routes';
import { adminBlogRouter } from './admin/blog.routes';

// Main Express router for administrative APIs protected by Firebase authentication and admin authorization.
export const adminRouter = Router();

// Enforce authentication & admin authorization for all /api/v1/admin routes
adminRouter.use(authenticate, authorizeAdmin);

// Protected admin authentication verification route (GET /api/v1/admin/auth-check).
adminRouter.get('/auth-check', checkAdminAuth);

// Protected admin media routes (/api/v1/admin/media/*)
adminRouter.use('/media', adminMediaRouter);

// Protected admin site settings routes (/api/v1/admin/site/*)
adminRouter.use('/site', adminSiteRouter);

// Protected admin intro page routes (/api/v1/admin/intro/*)
adminRouter.use('/intro', adminIntroRouter);

// Protected admin home page routes (/api/v1/admin/home/*)
adminRouter.use('/home', adminHomeRouter);

// Protected admin work page routes (/api/v1/admin/work/*)
adminRouter.use('/work', adminWorkRouter);

// Protected admin listing page chrome routes
adminRouter.use('/development', adminDevelopmentRouter);
adminRouter.use('/art', adminArtRouter);
adminRouter.use('/blog-page', adminBlogPageRouter);
adminRouter.use('/experience-page', adminExperiencePageRouter);

// Protected admin about profile routes (/api/v1/admin/about/*)
adminRouter.use('/about', adminAboutRouter);

// Protected admin social links routes (/api/v1/admin/social-links/*)
adminRouter.use('/social-links', adminSocialRouter);

// Protected admin projects routes (/api/v1/admin/projects/*)
adminRouter.use('/projects', adminProjectRouter);

// Protected admin artworks routes (/api/v1/admin/artworks/*)
adminRouter.use('/artworks', adminArtworkRouter);

// Protected admin professional experience routes (/api/v1/admin/experience/*)
adminRouter.use('/experience', adminExperienceRouter);

// Protected admin education routes (/api/v1/admin/education/*)
adminRouter.use('/education', adminEducationRouter);

// Protected admin contact page routes (/api/v1/admin/contact/*)
adminRouter.use('/contact', adminContactRouter);

// Protected admin theme settings routes (/api/v1/admin/theme/*)
adminRouter.use('/theme', adminThemeRouter);

// Protected admin blogs routes (/api/v1/admin/blogs/*)
adminRouter.use('/blogs', adminBlogRouter);
