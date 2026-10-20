// Representation of a verified authenticated Firebase user attached to Express requests.
export interface AuthenticatedUser {
  uid: string;
  email?: string;
  emailVerified?: boolean;
}

// Declaration merging to augment Express Request interface with authenticated user property.
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
