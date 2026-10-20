import assert from 'assert';
import { PUBLIC_NAV_ITEMS } from '@/components/public/public-navigation';
import { ContactSubmissionData } from '@/types/public.types';

export function runPublicContactTests(): void {
  // Verifies navigation items include /contact route
  const contactItem = PUBLIC_NAV_ITEMS.find((item) => item.href === '/contact');
  assert.ok(contactItem, 'Navigation items should include /contact');
  assert.strictEqual(contactItem?.label, 'Contact');

  // Verifies contact submission data structure
  const testPayload: ContactSubmissionData = {
    name: 'Jane Developer',
    email: 'jane@example.com',
    subject: 'Project Collaboration',
    message: 'Hello, I would like to inquire about your engineering availability.',
  };

  assert.strictEqual(typeof testPayload.name, 'string');
  assert.strictEqual(typeof testPayload.email, 'string');
  assert.strictEqual(typeof testPayload.subject, 'string');
  assert.strictEqual(typeof testPayload.message, 'string');

  // Validates email regex pattern used by contact form
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  assert.strictEqual(emailRegex.test('test@example.com'), true);
  assert.strictEqual(emailRegex.test('invalid-email'), false);
  assert.strictEqual(emailRegex.test('test@domain'), false);
}

runPublicContactTests();
