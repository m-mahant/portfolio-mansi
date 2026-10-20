import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';

interface RateLimitRecord {
  timestamps: number[];
}

const windowMs = 60 * 60 * 1000; // 60 minutes window
const maxRequests = 3; // 3 submissions limit per hour per IP
const ipRecords = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRecords.entries()) {
    record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);
    if (record.timestamps.length === 0) {
      ipRecords.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref(); // Run cleanup every 5 minutes

// Rate limiting middleware for public contact form submissions.
export function contactRateLimiter(req: Request, res: Response, next: NextFunction): void {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
  const now = Date.now();

  let record = ipRecords.get(clientIp);
  if (!record) {
    record = { timestamps: [] };
    ipRecords.set(clientIp, record);
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  const remaining = Math.max(0, maxRequests - record.timestamps.length);
  res.setHeader('X-RateLimit-Limit', String(maxRequests));
  res.setHeader('X-RateLimit-Remaining', String(remaining));

  if (record.timestamps.length >= maxRequests) {
    throw AppError.tooManyRequests('Too many contact submissions from this IP address. Please try again in an hour.');
  }

  record.timestamps.push(now);
  res.setHeader('X-RateLimit-Remaining', String(Math.max(0, remaining - 1)));
  next();
}

// Reset rate limits (utility for unit testing)
export function resetContactRateLimiter(): void {
  ipRecords.clear();
}
