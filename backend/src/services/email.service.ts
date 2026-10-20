import { Resend } from 'resend';
import { env } from '../config/env.config';
import { ContactMessage } from '../types/database.types';

let resendClient: Resend | null = null;

// Lazily initializes the Resend client only when an API key is configured.
function getResendClient(): Resend | null {
  if (!env.resendApiKey) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(env.resendApiKey);
  }
  return resendClient;
}

// Caps notification sends well under Resend's free-tier daily quota so a burst of
// spam can never exhaust the account and silently block real inquiries that day.
const MAX_NOTIFICATIONS_PER_DAY = 25;
const DAY_MS = 24 * 60 * 60 * 1000;
let notificationTimestamps: number[] = [];

function canSendNotification(): boolean {
  const now = Date.now();
  notificationTimestamps = notificationTimestamps.filter((ts) => now - ts < DAY_MS);
  return notificationTimestamps.length < MAX_NOTIFICATIONS_PER_DAY;
}

// Sends a best-effort email notification for a new contact form submission; never throws.
export async function sendContactNotification(submission: ContactMessage): Promise<void> {
  const client = getResendClient();

  if (!client || !env.contactNotificationEmail) {
    return;
  }

  if (!canSendNotification()) {
    process.stderr.write('[EmailService Warning] Daily contact notification cap reached; skipping send.\n');
    return;
  }

  try {
    notificationTimestamps.push(Date.now());
    await client.emails.send({
      from: `Portfolio Contact Form <${env.contactFromEmail}>`,
      to: env.contactNotificationEmail,
      replyTo: submission.email,
      subject: `New contact message: ${submission.subject}`,
      text: [
        `From: ${submission.name} <${submission.email}>`,
        `Subject: ${submission.subject}`,
        '',
        submission.message,
      ].join('\n'),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown email send error';
    process.stderr.write(`[EmailService Warning] Failed to send contact notification: ${message}\n`);
  }
}
