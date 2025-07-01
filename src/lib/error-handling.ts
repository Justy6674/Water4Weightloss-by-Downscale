/**
 * Centralized Error Handling Utilities
 * 
 * This module provides robust error handling patterns with:
 * - Type-safe error classification
 * - User-friendly error messages
 * - Development vs production error reporting
 * - Firebase-specific error handling
 */

import { FirebaseError } from 'firebase/app';

export enum ErrorType {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NETWORK = 'network',
  VALIDATION = 'validation',
  FIREBASE = 'firebase',
  ENVIRONMENT = 'environment',
  UNKNOWN = 'unknown',
}

export interface AppError {
  type: ErrorType;
  code?: string;
  message: string;
  userMessage: string;
  details?: any;
  stack?: string;
}

/**
 * Firebase-specific error mappings
 */
const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  // Auth errors
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Invalid email or password. Please check your credentials.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password should be at least 6 characters long.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled. Please contact support.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'auth/invalid-verification-code': 'Invalid verification code. Please try again.',
  'auth/code-expired': 'Verification code has expired. Please request a new one.',
  'auth/missing-phone-number': 'Please enter a valid phone number.',
  'auth/quota-exceeded': 'SMS quota exceeded. Please try again later.',
  
  // Firestore errors
  'firestore/permission-denied': 'You do not have permission to access this data.',
  'firestore/not-found': 'The requested document was not found.',
  'firestore/already-exists': 'Document already exists.',
  'firestore/resource-exhausted': 'Request quota exceeded. Please try again later.',
  'firestore/failed-precondition': 'Database not properly configured. Please contact support.',
  'firestore/aborted': 'Operation was aborted due to a conflict.',
  'firestore/out-of-range': 'Invalid data range provided.',
  'firestore/unimplemented': 'This operation is not supported.',
  'firestore/internal': 'Internal server error. Please try again later.',
  'firestore/unavailable': 'Service is temporarily unavailable. Please try again.',
  'firestore/data-loss': 'Unrecoverable data loss or corruption.',
  'firestore/unauthenticated': 'You must be signed in to perform this action.',
};

/**
 * Converts any error into a standardized AppError
 */
export function normalizeError(error: unknown): AppError {
  // Handle AppError (already normalized)
  if (isAppError(error)) {
    return error;
  }

  // Handle Firebase errors
  if (error instanceof FirebaseError) {
    return handleFirebaseError(error);
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      type: ErrorType.UNKNOWN,
      message: error.message,
      userMessage: 'An unexpected error occurred. Please try again.',
      stack: error.stack,
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      type: ErrorType.UNKNOWN,
      message: error,
      userMessage: 'An unexpected error occurred. Please try again.',
    };
  }

  // Handle unknown error types
  return {
    type: ErrorType.UNKNOWN,
    message: 'Unknown error occurred',
    userMessage: 'An unexpected error occurred. Please try again.',
    details: error,
  };
}

/**
 * Handles Firebase-specific errors
 */
function handleFirebaseError(error: FirebaseError): AppError {
  const userMessage = FIREBASE_ERROR_MESSAGES[error.code] || 
    'A Firebase service error occurred. Please try again.';

  let type = ErrorType.FIREBASE;
  
  if (error.code.startsWith('auth/')) {
    type = error.code.includes('permission') || error.code.includes('credential') 
      ? ErrorType.AUTHORIZATION 
      : ErrorType.AUTHENTICATION;
  } else if (error.code.startsWith('firestore/')) {
    type = error.code.includes('permission') || error.code.includes('unauthenticated')
      ? ErrorType.AUTHORIZATION
      : ErrorType.FIREBASE;
  }

  return {
    type,
    code: error.code,
    message: error.message,
    userMessage,
    details: {
      customData: error.customData,
    },
    stack: error.stack,
  };
}

/**
 * Type guard to check if an object is an AppError
 */
function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'message' in error &&
    'userMessage' in error
  );
}

/**
 * Logs error appropriately based on environment
 */
export function logError(error: AppError, context?: string): void {
  const prefix = context ? `[${context}]` : '';
  
  if (process.env.NODE_ENV === 'development') {
    console.error(`${prefix} AppError:`, {
      type: error.type,
      code: error.code,
      message: error.message,
      userMessage: error.userMessage,
      details: error.details,
      stack: error.stack,
    });
  } else {
    // In production, log less sensitive information
    console.error(`${prefix} Error:`, {
      type: error.type,
      code: error.code,
      userMessage: error.userMessage,
    });
  }

  // Here you could integrate with error reporting services like Sentry
  // reportToErrorService(error, context);
}

/**
 * Returns appropriate error message for display to users
 */
export function getDisplayMessage(error: unknown): string {
  const normalizedError = normalizeError(error);
  return normalizedError.userMessage;
}

/**
 * Creates a user-friendly error for authentication issues
 */
export function createAuthError(message: string, code?: string): AppError {
  return {
    type: ErrorType.AUTHENTICATION,
    code,
    message,
    userMessage: message,
  };
}

/**
 * Creates a user-friendly error for network issues
 */
export function createNetworkError(message?: string): AppError {
  return {
    type: ErrorType.NETWORK,
    message: message || 'Network request failed',
    userMessage: 'Please check your internet connection and try again.',
  };
}

/**
 * Creates a user-friendly error for validation issues
 */
export function createValidationError(message: string, details?: any): AppError {
  return {
    type: ErrorType.VALIDATION,
    message,
    userMessage: message,
    details,
  };
}

/**
 * Async error handler that wraps async operations
 */
export async function handleAsync<T>(
  operation: () => Promise<T>,
  context?: string
): Promise<[T | null, AppError | null]> {
  try {
    const result = await operation();
    return [result, null];
  } catch (error) {
    const normalizedError = normalizeError(error);
    if (context) {
      logError(normalizedError, context);
    }
    return [null, normalizedError];
  }
}

/**
 * Retry logic for operations that might fail temporarily
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delay?: number;
    context?: string;
  } = {}
): Promise<T> {
  const { maxAttempts = 3, delay = 1000, context } = options;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      const normalizedError = normalizeError(error);
      
      if (attempt === maxAttempts) {
        logError(normalizedError, context);
        throw normalizedError;
      }
      
      // Don't retry certain types of errors
      if (normalizedError.type === ErrorType.AUTHENTICATION || 
          normalizedError.type === ErrorType.AUTHORIZATION ||
          normalizedError.type === ErrorType.VALIDATION) {
        logError(normalizedError, context);
        throw normalizedError;
      }
      
      console.warn(`${context ? `[${context}]` : ''} Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('This should never be reached');
}
