import { Router } from 'express';
import { getHealthStatus } from '../controllers/health.controller';

// Creates and registers health check endpoint routing handlers.
export function createHealthRouter(): Router {
  const router = Router();
  router.get('/health', getHealthStatus);
  return router;
}

export const healthRouter = createHealthRouter();
