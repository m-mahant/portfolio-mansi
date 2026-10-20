import { workPageRepository } from '../repositories/work-page.repository';
import { WorkPageConfig } from '../types/database.types';

export interface PublicWorkPageResponse {
  config: WorkPageConfig;
}

export class WorkPageService {
  // Returns public work overview configuration (no unused featured lists).
  async getPublicWorkPage(): Promise<PublicWorkPageResponse> {
    const config = await workPageRepository.getWorkPageConfig();
    return { config };
  }

  // Gets work page configuration for administrative management.
  async getAdminWorkPage(): Promise<WorkPageConfig> {
    return workPageRepository.getWorkPageConfig();
  }

  // Updates work page configuration document.
  async updateAdminWorkPage(updates: Partial<WorkPageConfig>): Promise<WorkPageConfig> {
    return workPageRepository.updateWorkPageConfig(updates);
  }
}

export const workPageService = new WorkPageService();
