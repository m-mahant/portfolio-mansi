import { blogPageRepository } from '../repositories/blog-page.repository';
import { BlogPageConfig } from '../types/database.types';

export class BlogPageService {
  async getPublicConfig(): Promise<BlogPageConfig> {
    return blogPageRepository.getConfig();
  }

  async getAdminConfig(): Promise<BlogPageConfig> {
    return blogPageRepository.getConfig();
  }

  async updateAdminConfig(updates: Partial<BlogPageConfig>): Promise<BlogPageConfig> {
    return blogPageRepository.updateConfig(updates);
  }
}

export const blogPageService = new BlogPageService();
