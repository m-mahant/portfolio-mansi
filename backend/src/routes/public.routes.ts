import { Router } from 'express';
import { getSiteSettings } from '../controllers/site-settings.controller';
import { getPublicIntroPage } from '../controllers/intro-page.controller';
import { getPublicHomePage } from '../controllers/home-page.controller';
import { getPublicWorkPage } from '../controllers/work-page.controller';
import { getPublicDevelopmentPage } from '../controllers/development-page.controller';
import { getPublicArtPage } from '../controllers/art-page.controller';
import { getPublicBlogPage } from '../controllers/blog-page.controller';
import { getPublicExperiencePage } from '../controllers/experience-page.controller';
import { getAboutProfile } from '../controllers/about.controller';
import { getSocialLinks } from '../controllers/social-link.controller';
import { getProjects, getProjectBySlug } from '../controllers/project.controller';
import { getArtworks, getArtworkBySlug } from '../controllers/artwork.controller';
import { getExperiences } from '../controllers/experience.controller';
import { getEducation } from '../controllers/education.controller';
import { getPublicContactPage } from '../controllers/contact-page.controller';
import { getThemeSettings } from '../controllers/theme.controller';
import { getPublicBlogs, getPublicBlogBySlug } from '../controllers/blog.controller';
import { contactController } from '../controllers/contact.controller';
import { contactRateLimiter } from '../middleware/rate-limit.middleware';

const router = Router();

// Site settings
router.get('/site', getSiteSettings);

// Intro page
router.get('/intro', getPublicIntroPage);

// Home page
router.get('/home', getPublicHomePage);

// Work page
router.get('/work', getPublicWorkPage);

// Listing page chrome configs
router.get('/development', getPublicDevelopmentPage);
router.get('/art', getPublicArtPage);
router.get('/blog-page', getPublicBlogPage);
router.get('/experience-page', getPublicExperiencePage);

// About profile
router.get('/about', getAboutProfile);

// Social links
router.get('/social', getSocialLinks);
router.get('/social-links', getSocialLinks);

// Contact page configuration & submission
router.get('/contact', getPublicContactPage);
router.post('/contact', contactRateLimiter, contactController.submitContact);

// Software projects
router.get('/projects', getProjects);
router.get('/projects/:slug', getProjectBySlug);

// Art & Crafts entries
router.get('/artworks', getArtworks);
router.get('/artworks/:slug', getArtworkBySlug);

// Blog posts
router.get('/blogs', getPublicBlogs);
router.get('/blogs/:slug', getPublicBlogBySlug);

// Career experience catalog
router.get('/experience', getExperiences);

// Education history catalog
router.get('/education', getEducation);

// Dynamic visual theme
router.get('/theme', getThemeSettings);

export const publicRouter = router;
