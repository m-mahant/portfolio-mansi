'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { submitContact } from '@/services/api/public-api';
import { ContactSubmissionData, ContactInquiryType } from '@/types/public.types';
import { PublicButton } from '../public-button';

// Form input state interface
interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  general?: string;
}

const INQUIRY_TYPE_OPTIONS: { value: ContactInquiryType; label: string }[] = [
  { value: 'new-build', label: 'New software build' },
  { value: 'maintenance', label: 'Maintenance / fix an existing app' },
  { value: 'consulting', label: 'Technical consulting' },
  { value: 'art-commission', label: 'Art / mural commission' },
  { value: 'other', label: 'Something else' },
];


function inquiryTypeFromQuery(value: string | null): ContactInquiryType | '' {
  return INQUIRY_TYPE_OPTIONS.some((opt) => opt.value === value) ? (value as ContactInquiryType) : '';
}

// Renders the interactive contact form with validation, submission, and success/error feedback.
export const ContactForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<ContactSubmissionData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: inquiryTypeFromQuery(searchParams.get('type')) || undefined,
    budget: '',
    timeline: '',
    website: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must not exceed 100 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.length > 150) {
      newErrors.subject = 'Subject must not exceed 150 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length > 3000) {
      newErrors.message = 'Message must not exceed 3000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await submitContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        inquiryType: formData.inquiryType || undefined,
        budget: formData.budget?.trim() || undefined,
        timeline: formData.timeline?.trim() || undefined,
        website: formData.website,
      });

      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '', inquiryType: undefined, budget: '', timeline: '', website: '' });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to send message. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 p-6 sm:p-8">
      <div>
        <h2
          className="text-2xl font-bold tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-heading, inherit)' }}
        >
          Send a Message
        </h2>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Fill out the fields below to initiate contact. All submissions are processed securely.
        </p>
      </div>

      {isSuccess ? (
        <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--color-text)]">Message Delivered Successfully</h4>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                Thank you for getting in touch. I will review your message and reply as soon as possible.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsSuccess(false)}
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 underline focus:outline-none"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Honeypot: hidden from real visitors, left for spam bots that autofill every field. */}
          <div
            aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
          >
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          {errors.general && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errors.general}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="block text-xs font-medium text-[var(--color-muted)]">
                Full Name <span className="text-[var(--color-primary)]">*</span>
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                maxLength={100}
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                className={`w-full px-4 py-2.5 rounded-xl bg-[var(--color-background)] border text-[var(--color-text)] placeholder-[var(--color-muted)]/60 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                  errors.name ? 'border-rose-500' : 'border-[var(--color-border)] focus:border-[var(--color-primary)]/50'
                }`}
              />
              {errors.name && (
                <p id="contact-name-error" className="text-xs text-rose-400 font-medium">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="block text-xs font-medium text-[var(--color-muted)]">
                Email Address <span className="text-[var(--color-primary)]">*</span>
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                maxLength={255}
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                className={`w-full px-4 py-2.5 rounded-xl bg-[var(--color-background)] border text-[var(--color-text)] placeholder-[var(--color-muted)]/60 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                  errors.email ? 'border-rose-500' : 'border-[var(--color-border)] focus:border-[var(--color-primary)]/50'
                }`}
              />
              {errors.email && (
                <p id="contact-email-error" className="text-xs text-rose-400 font-medium">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label htmlFor="contact-subject" className="block text-xs font-medium text-[var(--color-muted)]">
              Subject <span className="text-[var(--color-primary)]">*</span>
            </label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              required
              maxLength={150}
              value={formData.subject}
              onChange={handleChange}
              placeholder="Engineering Inquiry / Creative Commission"
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
              className={`w-full px-4 py-2.5 rounded-xl bg-[var(--color-background)] border text-[var(--color-text)] placeholder-[var(--color-muted)]/60 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                errors.subject ? 'border-rose-500' : 'border-[var(--color-border)] focus:border-[var(--color-primary)]/50'
              }`}
            />
            {errors.subject && (
              <p id="contact-subject-error" className="text-xs text-rose-400 font-medium">
                {errors.subject}
              </p>
            )}
          </div>

          {/* What do you need? / Budget / Timeline — all optional, just helps triage the inquiry */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="contact-inquiry-type" className="block text-xs font-medium text-[var(--color-muted)]">
                What do you need?
              </label>
              <select
                id="contact-inquiry-type"
                name="inquiryType"
                value={formData.inquiryType || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)] text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]/50"
              >
                <option value="">Not sure yet</option>
                {INQUIRY_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-budget" className="block text-xs font-medium text-[var(--color-muted)]">
                Budget <span className="text-[var(--color-muted)]/60">(optional)</span>
              </label>
              <input
                id="contact-budget"
                name="budget"
                type="text"
                maxLength={100}
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g. ₹50,000"
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-muted)]/60 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]/50"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-timeline" className="block text-xs font-medium text-[var(--color-muted)]">
                Timeline <span className="text-[var(--color-muted)]/60">(optional)</span>
              </label>
              <input
                id="contact-timeline"
                name="timeline"
                type="text"
                maxLength={100}
                value={formData.timeline}
                onChange={handleChange}
                placeholder="e.g. 2-3 weeks"
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-muted)]/60 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]/50"
              />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label htmlFor="contact-message" className="block text-xs font-medium text-[var(--color-muted)]">
              Message <span className="text-[var(--color-primary)]">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              maxLength={3000}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your project, timeline, or inquiry details..."
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
              className={`w-full px-4 py-3 rounded-xl bg-[var(--color-background)] border text-[var(--color-text)] placeholder-[var(--color-muted)]/60 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                errors.message ? 'border-rose-500' : 'border-[var(--color-border)] focus:border-[var(--color-primary)]/50'
              }`}
            />
            {errors.message && (
              <p id="contact-message-error" className="text-xs text-rose-400 font-medium">
                {errors.message}
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <PublicButton
              type="submit"
              variant="solid"
              size="lg"
              disabled={isSubmitting}
              className="w-full sm:w-auto min-w-0 sm:min-w-[160px] justify-center"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Send Message
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              )}
            </PublicButton>
          </div>
        </form>
      )}
    </div>
  );
};
