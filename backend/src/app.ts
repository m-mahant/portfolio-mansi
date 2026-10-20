import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.config';
import { healthRouter } from './routes/health.routes';
import { publicRouter } from './routes/public.routes';
import { adminRouter } from './routes/admin.routes';
import { notFoundHandler, errorHandler } from './middleware/error.middleware';
import { setupSwagger } from './config/swagger.config';

// Creates and configures the Express application instance with security, parsing, routes, Swagger documentation, and error handling.
export function createApp(): Express {
  const app = express();

  // Basic security headers
  app.use(helmet());

  // Configure CORS specifically for allowed frontend origin
  app.use(
    cors({
      origin: env.frontendUrl,
      credentials: true,
    })
  );

  // Request body parsing with size limit
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // OpenAPI Documentation UI endpoints (/api-docs, /api/v1/docs)
  setupSwagger(app);

  // API v1 routes
  app.use('/api/v1', healthRouter);
  app.use('/api/v1', publicRouter);
  app.use('/api/v1/admin', adminRouter);

  // 404 & Global Error Handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const app = createApp();
