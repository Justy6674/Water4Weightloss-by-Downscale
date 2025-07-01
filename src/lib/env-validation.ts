'use client';

/**
 * Environment Variable Validation
 * 
 * This module provides robust validation of environment variables with:
 * - Type safety
 * - Runtime validation
 * - Clear error messages
 * - Graceful degradation
 */

interface EnvConfig {
  // Firebase Client Config
  NEXT_PUBLIC_FIREBASE_API_KEY: string;
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
  NEXT_PUBLIC_FIREBASE_APP_ID: string;
  NEXT_PUBLIC_FIREBASE_VAPID_KEY?: string;
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY?: string;
}

interface ServerEnvConfig {
  // Server-only environment variables
  SERVICE_ACCOUNT_JSON: string;
  GOOGLE_AI_API_KEY?: string;
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_PHONE_NUMBER?: string;
  TWILIO_MESSAGING_SID?: string;
}

class EnvironmentError extends Error {
  constructor(message: string, public missingVars: string[]) {
    super(message);
    this.name = 'EnvironmentError';
  }
}

/**
 * Validates client-side environment variables
 */
export function validateClientEnv(): EnvConfig {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ] as const;

  const missingVars: string[] = [];
  const config: Partial<EnvConfig> = {};

  // Check required variables
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value || value.trim() === '') {
      missingVars.push(varName);
    } else {
      (config as any)[varName] = value.trim();
    }
  }

  // Check optional variables
  const optionalVars = ['NEXT_PUBLIC_FIREBASE_VAPID_KEY', 'NEXT_PUBLIC_RECAPTCHA_SITE_KEY'];
  for (const varName of optionalVars) {
    const value = process.env[varName];
    if (value && value.trim() !== '') {
      (config as any)[varName] = value.trim();
    }
  }

  if (missingVars.length > 0) {
    throw new EnvironmentError(
      `Missing required environment variables: ${missingVars.join(', ')}. Please check your .env.local file.`,
      missingVars
    );
  }

  return config as EnvConfig;
}

/**
 * Validates server-side environment variables
 */
export function validateServerEnv(): ServerEnvConfig {
  const requiredVars = ['SERVICE_ACCOUNT_JSON'] as const;
  const missingVars: string[] = [];
  const config: Partial<ServerEnvConfig> = {};

  // Check required variables
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value || value.trim() === '') {
      missingVars.push(varName);
    } else {
      (config as any)[varName] = value.trim();
    }
  }

  // Check optional variables
  const optionalVars = [
    'GOOGLE_AI_API_KEY',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER',
    'TWILIO_MESSAGING_SID',
  ];
  for (const varName of optionalVars) {
    const value = process.env[varName];
    if (value && value.trim() !== '') {
      (config as any)[varName] = value.trim();
    }
  }

  if (missingVars.length > 0) {
    throw new EnvironmentError(
      `Missing required server environment variables: ${missingVars.join(', ')}. Please check your .env.local file.`,
      missingVars
    );
  }

  return config as ServerEnvConfig;
}

/**
 * Safe getter for client environment variables with fallbacks
 */
export function getClientEnv(): EnvConfig | null {
  try {
    return validateClientEnv();
  } catch (error) {
    console.error('Environment validation failed:', error);
    return null;
  }
}

/**
 * Safe getter for server environment variables with fallbacks
 */
export function getServerEnv(): ServerEnvConfig | null {
  try {
    return validateServerEnv();
  } catch (error) {
    console.error('Server environment validation failed:', error);
    return null;
  }
}

/**
 * Checks if all required environment variables are present
 */
export function isEnvironmentValid(): boolean {
  try {
    validateClientEnv();
    return true;
  } catch {
    return false;
  }
}
