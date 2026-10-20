import { app } from './app';
import { env } from './config/env.config';
import { getFirebaseStatus } from './config/firebase.config';

// Starts the Express HTTP server listening on the configured port.
function startServer(): void {
  app.listen(env.port, () => {
    const status = getFirebaseStatus();
    // eslint-disable-next-line no-console
    console.log(`Lumenfolio Backend listening on http://localhost:${env.port} [${env.nodeEnv}]`);
    // eslint-disable-next-line no-console
    console.log(`Firebase Admin Status: Initialized=${status.initialized}, ProjectId=${status.projectId}`);
  });
}

startServer();
