import { Request, Response, NextFunction } from 'express';
import { contactService, ContactService } from '../services/contact.service';

// Controller for handling contact form submission HTTP requests.
export class ContactController {
  constructor(private readonly service: ContactService = contactService) {}

  // Handles POST /api/v1/contact endpoint.
  submitContact = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip;
      await this.service.submitContactMessage(req.body, clientIp);

      res.status(201).json({
        success: true,
        data: {
          message: 'Message sent successfully.',
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

export const contactController = new ContactController();
