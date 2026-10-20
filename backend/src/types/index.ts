export * from './database.types';
export * from './auth.types';

// Standard API success response envelope interface.
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// Standard API error response envelope interface.
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// Unified API response type union.
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Centralized environment configuration interface.
export interface EnvConfig {
  port: number;
  frontendUrl: string;
  nodeEnv: string;
  firebaseProjectId?: string;
  firebaseClientEmail?: string;
  firebasePrivateKey?: string;
  firebaseStorageBucket?: string;
  imagekitPublicKey?: string;
  imagekitPrivateKey?: string;
  imagekitUrlEndpoint?: string;
  bootstrapAdminEmail?: string;
}

// Firebase readiness status interface for internal diagnostic checks.
export interface FirebaseStatus {
  initialized: boolean;
  services: {
    firestore: boolean;
    storage: boolean;
    auth: boolean;
  };
  projectId?: string;
  error?: string;
}
