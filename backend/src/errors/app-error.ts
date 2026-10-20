// Custom application error class with HTTP status code and API error code.
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  // Factory helper for 400 Bad Request errors.
  static badRequest(message: string = 'Invalid request parameters.'): AppError {
    return new AppError(400, 'BAD_REQUEST', message);
  }

  // Factory helper for 401 Unauthorized errors.
  static unauthorized(message: string = 'Authentication is required.'): AppError {
    return new AppError(401, 'UNAUTHORIZED', message);
  }

  // Factory helper for 403 Forbidden errors.
  static forbidden(message: string = 'Administrator access is required.'): AppError {
    return new AppError(403, 'FORBIDDEN', message);
  }

  // Factory helper for 404 Not Found errors.
  static notFound(message: string = 'Requested resource was not found.'): AppError {
    return new AppError(404, 'RESOURCE_NOT_FOUND', message);
  }

  // Factory helper for 409 Conflict errors.
  static conflict(message: string = 'Resource conflict or duplicate entry.'): AppError {
    return new AppError(409, 'CONFLICT', message);
  }

  // Factory helper for 429 Too Many Requests errors.
  static tooManyRequests(message: string = 'Too many requests. Please try again later.'): AppError {
    return new AppError(429, 'TOO_MANY_REQUESTS', message);
  }

  // Factory helper for 500 Internal Server errors.
  static internal(message: string = 'An internal server error occurred.'): AppError {
    return new AppError(500, 'INTERNAL_SERVER_ERROR', message);
  }
}
