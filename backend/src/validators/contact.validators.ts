import { z } from 'zod';

// Strips basic HTML/script tags from input strings to prevent HTML/XSS injection.
export function sanitizePlainText(input: string): string {
  return input
    .replace(/<[^>]*>?/gm, '')
    .trim();
}

// Zod Schema for Public Contact Form Submissions
export const contactSubmissionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must not exceed 100 characters')
    .transform((val) => sanitizePlainText(val)),
  email: z
    .string()
    .trim()
    .min(5, 'Email is required')
    .max(255, 'Email must not exceed 255 characters')
    .email('Invalid email address format'),
  subject: z
    .string()
    .trim()
    .min(1, 'Subject is required')
    .max(150, 'Subject must not exceed 150 characters')
    .transform((val) => sanitizePlainText(val)),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(3000, 'Message must not exceed 3000 characters')
    .transform((val) => sanitizePlainText(val)),
  // Honeypot: real visitors never see or fill this field; bots that autofill every
  // input do. Non-empty means the submission is spam.
  website: z.string().max(200).optional(),
});

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;
