import { contactRepository, ContactRepository } from '../repositories/contact.repository';
import { contactSubmissionSchema, ContactSubmissionInput } from '../validators/contact.validators';
import { ContactMessage } from '../types/database.types';
import { AppError } from '../errors/app-error';
import { sendContactNotification } from './email.service';

// Service layer for validating and persisting user contact submissions.
export class ContactService {
  constructor(private readonly repository: ContactRepository = contactRepository) {}

  // Validates, sanitizes, and persists a user contact form submission.
  // Returns null for honeypot-triggered spam: pretend success, save nothing, send nothing.
  async submitContactMessage(payload: unknown, clientIp?: string): Promise<ContactMessage | null> {
    const parseResult = contactSubmissionSchema.safeParse(payload);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      const message = issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid contact form payload';
      throw AppError.badRequest(message);
    }

    const validatedInput: ContactSubmissionInput = parseResult.data;

    if (validatedInput.website) {
      return null;
    }

    const now = new Date().toISOString();
    const messageData: Omit<ContactMessage, 'id'> = {
      name: validatedInput.name,
      email: validatedInput.email,
      subject: validatedInput.subject,
      message: validatedInput.message,
      status: 'new',
      createdAt: now,
      updatedAt: now,
      ipAddress: clientIp,
    };

    const created = await this.repository.createMessage(messageData);

    // Email notification is best-effort; it must never fail the submission itself.
    void sendContactNotification(created);

    return created;
  }
}

export const contactService = new ContactService();
