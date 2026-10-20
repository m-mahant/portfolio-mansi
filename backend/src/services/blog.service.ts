import { blogRepository } from '../repositories/blog.repository';
import { Blog, BlogStatus } from '../types/database.types';
import { CreateBlogInput, UpdateBlogInput, BlogQueryInput } from '../validators/blog.validators';
import { AppError } from '../errors/app-error';

// Service layer for blog operations and business logic.
export class BlogService {
  // Fetches published blogs for public display with pagination and tag/category filtering.
  async getPublicBlogs(query: BlogQueryInput): Promise<{
    items: Blog[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const result = await blogRepository.listPublicBlogs({
      page,
      limit,
      tag: query.tag,
      category: query.category,
      search: query.search,
    });

    const totalPages = Math.ceil(result.total / limit) || 1;

    return {
      items: result.items,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  // Fetches a single published blog by slug.
  async getPublicBlogBySlug(slug: string): Promise<Blog> {
    const blog = await blogRepository.getBlogBySlug(slug);
    if (!blog || blog.status !== 'published') {
      throw AppError.notFound(`Blog post '${slug}' not found`);
    }
    return blog;
  }

  // Fetches all blogs for admin console with status filtering.
  async getAdminBlogs(query: BlogQueryInput): Promise<{
    items: Blog[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const result = await blogRepository.listAdminBlogs({
      page,
      limit,
      status: query.status as BlogStatus,
      search: query.search,
    });

    const totalPages = Math.ceil(result.total / limit) || 1;

    return {
      items: result.items,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  // Fetches a single blog by document ID for admin editing.
  async getBlogById(id: string): Promise<Blog> {
    const blog = await blogRepository.getBlogById(id);
    if (!blog) {
      throw AppError.notFound(`Blog post with ID '${id}' not found`);
    }
    return blog;
  }

  // Creates a new blog post entry.
  async createBlog(data: CreateBlogInput): Promise<Blog> {
    const existing = await blogRepository.getBlogBySlug(data.slug);
    if (existing) {
      throw AppError.conflict(`Blog post with slug '${data.slug}' already exists`);
    }

    return blogRepository.createBlog({
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      featuredImage: data.featuredImage,
      category: data.category,
      tags: data.tags || [],
      status: (data.status as BlogStatus) || 'draft',
      publishedAt: data.publishedAt,
      seo: data.seo,
    });
  }

  // Updates an existing blog post.
  async updateBlog(id: string, updates: UpdateBlogInput): Promise<Blog> {
    const blog = await blogRepository.getBlogById(id);
    if (!blog) {
      throw AppError.notFound(`Blog post with ID '${id}' not found`);
    }

    if (updates.slug && updates.slug !== blog.slug) {
      const existingSlug = await blogRepository.getBlogBySlug(updates.slug);
      if (existingSlug && existingSlug.id !== id) {
        throw AppError.conflict(`Blog post with slug '${updates.slug}' already exists`);
      }
    }

    const updated = await blogRepository.updateBlog(id, {
      ...updates,
      status: updates.status ? (updates.status as BlogStatus) : undefined,
    });

    if (!updated) {
      throw AppError.internal('Failed to update blog post');
    }

    return updated;
  }

  // Deletes a blog post entry.
  async deleteBlog(id: string): Promise<boolean> {
    const blog = await blogRepository.getBlogById(id);
    if (!blog) {
      throw AppError.notFound(`Blog post with ID '${id}' not found`);
    }

    return blogRepository.deleteBlog(id);
  }
}

export const blogService = new BlogService();
