import swaggerUi from 'swagger-ui-express';
import { Express, Request, Response } from 'express';
import { BRAND_DESCRIPTION, BRAND_NAME } from '../lib/brand';

// Complete OpenAPI 3.0.0 Specification for Mansi Mahant Backend APIs.
export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: `${BRAND_NAME} API`,
    version: '1.0.0',
    description: `${BRAND_DESCRIPTION} REST API for page configs, catalogs, media, and the public site.`,
    contact: {
      name: 'Portfolio Engineering Team',
    },
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Firebase Admin ID Token',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'object' },
          message: { type: 'string' },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              message: { type: 'string' },
              details: { type: 'object' },
            },
          },
        },
      },
      MediaRef: {
        type: 'object',
        properties: {
          mediaId: { type: 'string' },
          url: { type: 'string' },
          storagePath: { type: 'string' },
          altText: { type: 'string' },
          caption: { type: 'string' },
          width: { type: 'number' },
          height: { type: 'number' },
          displayOrder: { type: 'number' },
        },
      },
      SeoMetadata: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          keywords: { type: 'array', items: { type: 'string' } },
          ogImage: { type: 'string' },
          noIndex: { type: 'boolean' },
        },
      },
      IntroPageConfig: {
        type: 'object',
        properties: {
          headline: { type: 'string', example: 'Where Logic Meets' },
          headlineAccent: { type: 'string', example: 'Imagination' },
          subtitle: { type: 'string', example: 'Engineering digital experiences with the precision of code and the freedom of art.' },
          exploreButtonLabel: { type: 'string', example: 'Explore Portfolio' },
          exploreButtonTarget: { type: 'string', example: '/' },
          loadingText: { type: 'string', example: 'MANSI MAHANT' },
          autoRedirect: { type: 'boolean', example: false },
          autoRedirectDelay: { type: 'number', example: 5000 },
          showOnInitialVisit: { type: 'boolean', example: true },
          redirectTarget: { type: 'string', example: '/' },
          enabled: { type: 'boolean', example: true },
          seo: { $ref: '#/components/schemas/SeoMetadata' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['headline', 'exploreButtonLabel', 'enabled'],
      },
      Blog: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string', example: 'Building Scalable Cloud-Native Applications' },
          slug: { type: 'string', example: 'building-scalable-cloud-native-applications' },
          excerpt: { type: 'string', example: 'Deep dive into microservices architecture and Kubernetes orchestration.' },
          content: { type: 'string', example: 'Full article text explaining cloud architecture patterns...' },
          featuredImage: { $ref: '#/components/schemas/MediaRef' },
          author: { type: 'string', example: 'Mansi Mahant' },
          category: { type: 'string', example: 'Cloud Architecture' },
          tags: { type: 'array', items: { type: 'string' }, example: ['cloud', 'kubernetes', 'microservices'] },
          status: { type: 'string', enum: ['draft', 'published', 'archived'], example: 'published' },
          publishedAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          seo: { $ref: '#/components/schemas/SeoMetadata' },
        },
        required: ['id', 'title', 'slug', 'content', 'status', 'createdAt', 'updatedAt'],
      },
      BlogCreateRequest: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Designing Reliable Backend APIs' },
          slug: { type: 'string', example: 'designing-reliable-backend-apis' },
          excerpt: { type: 'string', example: 'Best practices for RESTful service design and validation.' },
          content: { type: 'string', example: 'Designing APIs requires strict schema validation and typing...' },
          featuredImage: { $ref: '#/components/schemas/MediaRef' },
          author: { type: 'string', example: 'Mansi Mahant' },
          category: { type: 'string', example: 'Backend Engineering' },
          tags: { type: 'array', items: { type: 'string' }, example: ['api', 'nodejs', 'typescript'] },
          status: { type: 'string', enum: ['draft', 'published', 'archived'], default: 'draft' },
          publishedAt: { type: 'string', format: 'date-time', nullable: true },
          seo: { $ref: '#/components/schemas/SeoMetadata' },
        },
        required: ['title', 'content'],
      },
      BlogUpdateRequest: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          slug: { type: 'string' },
          excerpt: { type: 'string' },
          content: { type: 'string' },
          featuredImage: { $ref: '#/components/schemas/MediaRef' },
          author: { type: 'string' },
          category: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          status: { type: 'string', enum: ['draft', 'published', 'archived'] },
          publishedAt: { type: 'string', format: 'date-time', nullable: true },
          seo: { $ref: '#/components/schemas/SeoMetadata' },
        },
      },
      BlogListResponse: {
        type: 'object',
        properties: {
          items: { type: 'array', items: { $ref: '#/components/schemas/Blog' } },
          total: { type: 'integer', example: 5 },
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 10 },
          totalPages: { type: 'integer', example: 1 },
          hasNext: { type: 'boolean', example: false },
          hasPrev: { type: 'boolean', example: false },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'System Health Check',
        tags: ['Health'],
        responses: {
          200: { description: 'System healthy' },
        },
      },
    },
    '/api/v1/site': {
      get: {
        summary: 'Public Site Settings',
        tags: ['Public'],
        responses: {
          200: { description: 'Site settings retrieved successfully' },
        },
      },
    },
    '/api/v1/intro': {
      get: {
        summary: 'Public Intro Page Configuration',
        tags: ['Public'],
        responses: {
          200: { description: 'Intro page config retrieved successfully' },
        },
      },
    },
    '/api/v1/home': {
      get: {
        summary: 'Public Home Page Configuration',
        tags: ['Public'],
        responses: {
          200: { description: 'Home page config retrieved' },
        },
      },
    },
    '/api/v1/work': {
      get: {
        summary: 'Public Work Overview Configuration',
        tags: ['Public'],
        responses: {
          200: { description: 'Work page config retrieved' },
        },
      },
    },
    '/api/v1/development': {
      get: {
        summary: 'Public Development Listing Page Configuration',
        tags: ['Public'],
        responses: {
          200: { description: 'Development page chrome retrieved' },
        },
      },
    },
    '/api/v1/art': {
      get: {
        summary: 'Public Art Listing Page Configuration',
        tags: ['Public'],
        responses: {
          200: { description: 'Art page chrome retrieved' },
        },
      },
    },
    '/api/v1/blog-page': {
      get: {
        summary: 'Public Blog Listing Page Configuration',
        tags: ['Public'],
        responses: {
          200: { description: 'Blog page chrome retrieved' },
        },
      },
    },
    '/api/v1/experience-page': {
      get: {
        summary: 'Public Experience Page Configuration',
        tags: ['Public'],
        responses: {
          200: { description: 'Experience page chrome retrieved' },
        },
      },
    },
    '/api/v1/about': {
      get: {
        summary: 'Public About Profile',
        tags: ['Public'],
        responses: {
          200: { description: 'About profile retrieved successfully' },
        },
      },
    },
    '/api/v1/social-links': {
      get: {
        summary: 'Public Social Links',
        tags: ['Public'],
        responses: {
          200: { description: 'Social links list retrieved' },
        },
      },
    },
    '/api/v1/social': {
      get: {
        summary: 'Public Social Links (Alias)',
        tags: ['Public'],
        responses: {
          200: { description: 'Social links list retrieved' },
        },
      },
    },
    '/api/v1/contact': {
      get: {
        summary: 'Public Contact Page Configuration',
        tags: ['Public'],
        responses: {
          200: { description: 'Contact page config retrieved successfully' },
        },
      },
      post: {
        summary: 'Submit Public Contact Message',
        tags: ['Public'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Alex Smith' },
                  email: { type: 'string', example: 'alex@example.com' },
                  subject: { type: 'string', example: 'Project Collaboration' },
                  message: { type: 'string', example: 'I would like to discuss a project...' },
                },
                required: ['name', 'email', 'subject', 'message'],
              },
            },
          },
        },
        responses: {
          201: { description: 'Contact message submitted successfully' },
          400: { description: 'Validation error' },
          429: { description: 'Rate limit exceeded' },
        },
      },
    },
    '/api/v1/projects': {
      get: {
        summary: 'Public Projects List',
        tags: ['Public'],
        parameters: [
          { name: 'featured', in: 'query', schema: { type: 'boolean' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          200: { description: 'Projects list retrieved' },
        },
      },
    },
    '/api/v1/projects/{slug}': {
      get: {
        summary: 'Public Project Detail by Slug',
        tags: ['Public'],
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Project retrieved' },
          404: { description: 'Project not found' },
        },
      },
    },
    '/api/v1/artworks': {
      get: {
        summary: 'Public Artworks List',
        tags: ['Public'],
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          200: { description: 'Artworks list retrieved' },
        },
      },
    },
    '/api/v1/artworks/{slug}': {
      get: {
        summary: 'Public Artwork Detail by Slug',
        tags: ['Public'],
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Artwork retrieved' },
          404: { description: 'Artwork not found' },
        },
      },
    },
    '/api/v1/blogs': {
      get: {
        summary: 'Public Published Blogs List',
        tags: ['Public'],
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'tag', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          200: {
            description: 'Published blogs retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/BlogListResponse' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/blogs/{slug}': {
      get: {
        summary: 'Public Published Blog Detail by Slug',
        tags: ['Public'],
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Published blog article retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Blog' },
                  },
                },
              },
            },
          },
          404: { description: 'Blog article not found or not published' },
        },
      },
    },
    '/api/v1/experience': {
      get: {
        summary: 'Public Professional Experience',
        tags: ['Public'],
        responses: {
          200: { description: 'Experience list retrieved' },
        },
      },
    },
    '/api/v1/education': {
      get: {
        summary: 'Public Education Entries',
        tags: ['Public'],
        responses: {
          200: { description: 'Education list retrieved' },
        },
      },
    },
    '/api/v1/theme': {
      get: {
        summary: 'Public Active Theme Settings',
        tags: ['Public'],
        responses: {
          200: { description: 'Theme settings retrieved' },
        },
      },
    },
    '/api/v1/admin/auth-check': {
      get: {
        summary: 'Verify Admin Authentication Token',
        tags: ['Admin Auth'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Admin token valid' },
          401: { description: 'Unauthorized token' },
          403: { description: 'Forbidden non-admin user' },
        },
      },
    },
    '/api/v1/admin/media/upload': {
      post: {
        summary: 'Upload Binary Media Asset to ImageKit',
        tags: ['Admin Media'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: { type: 'string', format: 'binary' },
                  mediaType: { type: 'string', enum: ['image', 'document'] },
                  slug: { type: 'string' },
                  altText: { type: 'string' },
                  caption: { type: 'string' },
                },
                required: ['file'],
              },
            },
          },
        },
        responses: {
          201: { description: 'Media uploaded successfully' },
          400: { description: 'Invalid upload request' },
        },
      },
    },
    '/api/v1/admin/media': {
      get: {
        summary: 'List Media Assets',
        tags: ['Admin Media'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Media list retrieved' },
        },
      },
    },
    '/api/v1/admin/media/{mediaId}': {
      get: {
        summary: 'Get Media Asset Metadata',
        tags: ['Admin Media'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'mediaId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Media asset metadata retrieved' },
          404: { description: 'Media asset not found' },
        },
      },
      patch: {
        summary: 'Update Media Asset Metadata',
        tags: ['Admin Media'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'mediaId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Metadata updated' },
        },
      },
      delete: {
        summary: 'Delete Media Asset',
        tags: ['Admin Media'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'mediaId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Asset purged from storage and database' },
        },
      },
    },
    '/api/v1/admin/site': {
      get: {
        summary: 'Get Site Settings (Admin)',
        tags: ['Admin CMS — Site'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Site settings retrieved' },
        },
      },
      patch: {
        summary: 'Update Site Settings (Admin)',
        tags: ['Admin CMS — Site'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Site settings updated' },
        },
      },
    },
    '/api/v1/admin/intro': {
      get: {
        summary: 'Get Intro Page Configuration (Admin)',
        tags: ['Admin CMS — Intro'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Intro page configuration retrieved' },
        },
      },
      patch: {
        summary: 'Update Intro Page Configuration (Admin)',
        tags: ['Admin CMS — Intro'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Intro page configuration updated' },
        },
      },
      put: {
        summary: 'Update Intro Page Configuration (Admin)',
        tags: ['Admin CMS — Intro'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Intro page configuration updated' },
        },
      },
    },
    '/api/v1/admin/home': {
      get: {
        summary: 'Get Home Page Configuration (Admin)',
        tags: ['Admin CMS — Home'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Home page configuration retrieved' },
        },
      },
      patch: {
        summary: 'Update Home Page Configuration (Admin)',
        tags: ['Admin CMS — Home'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Home page configuration updated' },
        },
      },
      put: {
        summary: 'Update Home Page Configuration (Admin)',
        tags: ['Admin CMS — Home'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Home page configuration updated' },
        },
      },
    },
    '/api/v1/admin/work': {
      get: {
        summary: 'Get Work Page Configuration (Admin)',
        tags: ['Admin CMS — Work'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Work page configuration retrieved' },
        },
      },
      patch: {
        summary: 'Update Work Page Configuration (Admin)',
        tags: ['Admin CMS — Work'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Work page configuration updated' },
        },
      },
    },
    '/api/v1/admin/development': {
      get: {
        summary: 'Get Development Page Configuration (Admin)',
        tags: ['Admin CMS — Development'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Development page configuration retrieved' },
        },
      },
      patch: {
        summary: 'Update Development Page Configuration (Admin)',
        tags: ['Admin CMS — Development'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Development page configuration updated' },
        },
      },
    },
    '/api/v1/admin/art': {
      get: {
        summary: 'Get Art Page Configuration (Admin)',
        tags: ['Admin CMS — Art'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Art page configuration retrieved' },
        },
      },
      patch: {
        summary: 'Update Art Page Configuration (Admin)',
        tags: ['Admin CMS — Art'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Art page configuration updated' },
        },
      },
    },
    '/api/v1/admin/blog-page': {
      get: {
        summary: 'Get Blog Page Configuration (Admin)',
        tags: ['Admin CMS — Blog Page'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Blog page configuration retrieved' },
        },
      },
      patch: {
        summary: 'Update Blog Page Configuration (Admin)',
        tags: ['Admin CMS — Blog Page'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Blog page configuration updated' },
        },
      },
    },
    '/api/v1/admin/experience-page': {
      get: {
        summary: 'Get Experience Page Configuration (Admin)',
        tags: ['Admin CMS — Experience Page'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Experience page configuration retrieved' },
        },
      },
      patch: {
        summary: 'Update Experience Page Configuration (Admin)',
        tags: ['Admin CMS — Experience Page'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Experience page configuration updated' },
        },
      },
    },
    '/api/v1/admin/contact': {
      get: {
        summary: 'Get Contact Page Configuration (Admin)',
        tags: ['Admin CMS — Contact'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Contact page configuration retrieved' },
        },
      },
      patch: {
        summary: 'Update Contact Page Configuration (Admin)',
        tags: ['Admin CMS — Contact'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Contact page configuration updated' },
        },
      },
      put: {
        summary: 'Update Contact Page Configuration (Admin)',
        tags: ['Admin CMS — Contact'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Contact page configuration updated' },
        },
      },
    },

    '/api/v1/admin/about': {
      get: {
        summary: 'Get About Profile (Admin)',
        tags: ['Admin CMS — About'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'About profile retrieved' },
        },
      },
      patch: {
        summary: 'Update About Profile (Admin)',
        tags: ['Admin CMS — About'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'About profile updated' },
        },
      },
    },
    '/api/v1/admin/social-links': {
      get: {
        summary: 'List Social Links (Admin)',
        tags: ['Admin CMS — Social Links'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Social links retrieved' },
        },
      },
      post: {
        summary: 'Create Social Link (Admin)',
        tags: ['Admin CMS — Social Links'],
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: 'Social link created' },
        },
      },
    },
    '/api/v1/admin/social-links/{socialId}': {
      patch: {
        summary: 'Update Social Link (Admin)',
        tags: ['Admin CMS — Social Links'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'socialId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Social link updated' },
        },
      },
      delete: {
        summary: 'Delete Social Link (Admin)',
        tags: ['Admin CMS — Social Links'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'socialId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Social link deleted' },
        },
      },
    },
    '/api/v1/admin/projects': {
      get: {
        summary: 'List Projects (Admin)',
        tags: ['Admin CMS — Projects'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Projects list retrieved' },
        },
      },
      post: {
        summary: 'Create Project (Admin)',
        tags: ['Admin CMS — Projects'],
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: 'Project created' },
          409: { description: 'Duplicate slug conflict' },
        },
      },
    },
    '/api/v1/admin/projects/{projectId}': {
      get: {
        summary: 'Get Project by ID (Admin)',
        tags: ['Admin CMS — Projects'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'projectId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Project retrieved' },
          404: { description: 'Project not found' },
        },
      },
      patch: {
        summary: 'Update Project (Admin)',
        tags: ['Admin CMS — Projects'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'projectId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Project updated' },
          409: { description: 'Duplicate slug conflict' },
        },
      },
      delete: {
        summary: 'Delete Project Document (Admin)',
        tags: ['Admin CMS — Projects'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'projectId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Project deleted' },
        },
      },
    },
    '/api/v1/admin/artworks': {
      get: {
        summary: 'List Artworks (Admin)',
        tags: ['Admin CMS — Artworks'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Artworks list retrieved' },
        },
      },
      post: {
        summary: 'Create Artwork (Admin)',
        tags: ['Admin CMS — Artworks'],
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: 'Artwork created' },
          409: { description: 'Duplicate slug conflict' },
        },
      },
    },
    '/api/v1/admin/artworks/{artworkId}': {
      get: {
        summary: 'Get Artwork by ID (Admin)',
        tags: ['Admin CMS — Artworks'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'artworkId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Artwork retrieved' },
          404: { description: 'Artwork not found' },
        },
      },
      patch: {
        summary: 'Update Artwork (Admin)',
        tags: ['Admin CMS — Artworks'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'artworkId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Artwork updated' },
          409: { description: 'Duplicate slug conflict' },
        },
      },
      delete: {
        summary: 'Delete Artwork Document (Admin)',
        tags: ['Admin CMS — Artworks'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'artworkId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Artwork deleted' },
        },
      },
    },
    '/api/v1/admin/experience': {
      get: {
        summary: 'List Experience Entries (Admin)',
        tags: ['Admin CMS — Experience'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Experience list retrieved' },
        },
      },
      post: {
        summary: 'Create Experience Entry (Admin)',
        tags: ['Admin CMS — Experience'],
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: 'Experience entry created' },
        },
      },
    },
    '/api/v1/admin/experience/{experienceId}': {
      patch: {
        summary: 'Update Experience Entry (Admin)',
        tags: ['Admin CMS — Experience'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'experienceId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Experience entry updated' },
        },
      },
      delete: {
        summary: 'Delete Experience Entry (Admin)',
        tags: ['Admin CMS — Experience'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'experienceId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Experience entry deleted' },
        },
      },
    },
    '/api/v1/admin/education': {
      get: {
        summary: 'List Education Entries (Admin)',
        tags: ['Admin CMS — Education'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Education list retrieved' },
        },
      },
      post: {
        summary: 'Create Education Entry (Admin)',
        tags: ['Admin CMS — Education'],
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: 'Education entry created' },
        },
      },
    },
    '/api/v1/admin/education/{educationId}': {
      patch: {
        summary: 'Update Education Entry (Admin)',
        tags: ['Admin CMS — Education'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'educationId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Education entry updated' },
        },
      },
      delete: {
        summary: 'Delete Education Entry (Admin)',
        tags: ['Admin CMS — Education'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'educationId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Education entry deleted' },
        },
      },
    },
    '/api/v1/admin/theme': {
      get: {
        summary: 'Get Theme Settings (Admin)',
        tags: ['Admin CMS — Theme'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Theme settings retrieved' },
        },
      },
      patch: {
        summary: 'Update Theme Settings (Admin)',
        tags: ['Admin CMS — Theme'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Theme settings updated' },
        },
      },
    },
    '/api/v1/admin/blogs': {
      get: {
        summary: 'List All Blogs (Admin)',
        tags: ['Admin CMS — Blogs'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['draft', 'published', 'archived'] } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'tag', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          200: {
            description: 'All blogs retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/BlogListResponse' },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
        },
      },
      post: {
        summary: 'Create Blog Article (Admin)',
        tags: ['Admin CMS — Blogs'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/BlogCreateRequest' },
            },
          },
        },
        responses: {
          201: { description: 'Blog article created successfully' },
          400: { description: 'Validation error' },
          409: { description: 'Duplicate slug conflict' },
        },
      },
    },
    '/api/v1/admin/blogs/{blogId}': {
      get: {
        summary: 'Get Blog Article by ID (Admin)',
        tags: ['Admin CMS — Blogs'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'blogId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Blog article retrieved' },
          404: { description: 'Blog article not found' },
        },
      },
      patch: {
        summary: 'Update Blog Article (Admin)',
        tags: ['Admin CMS — Blogs'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'blogId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/BlogUpdateRequest' },
            },
          },
        },
        responses: {
          200: { description: 'Blog article updated successfully' },
          400: { description: 'Validation error' },
          404: { description: 'Blog article not found' },
          409: { description: 'Duplicate slug conflict' },
        },
      },
      delete: {
        summary: 'Delete Blog Article (Admin)',
        tags: ['Admin CMS — Blogs'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'blogId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Blog article deleted successfully' },
          404: { description: 'Blog article not found' },
        },
      },
    },
  },
};

// Configures and mounts interactive Swagger UI middleware on an Express application instance.
export function setupSwagger(app: Express): void {
  app.get('/api-docs/json', (_req: Request, res: Response) => {
    res.json(openApiSpec);
  });
  app.get('/api/v1/docs/json', (_req: Request, res: Response) => {
    res.json(openApiSpec);
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
}
