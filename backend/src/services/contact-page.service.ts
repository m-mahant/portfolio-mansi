import { contactPageRepository } from '../repositories/contact-page.repository';
import { ContactPageConfig } from '../types/database.types';

export class ContactPageService {
  // Retrieves contact page configuration for public display.
  async getPublicContactPage(): Promise<ContactPageConfig> {
    return contactPageRepository.getContactPageConfig();
  }

  // Gets contact page configuration for administrative management.
  async getAdminContactPage(): Promise<ContactPageConfig> {
    return contactPageRepository.getContactPageConfig();
  }

  // Updates contact page configuration document.
  async updateAdminContactPage(updates: Partial<ContactPageConfig>): Promise<ContactPageConfig> {
    return contactPageRepository.updateContactPageConfig(updates);
  }
}

export const contactPageService = new ContactPageService();
