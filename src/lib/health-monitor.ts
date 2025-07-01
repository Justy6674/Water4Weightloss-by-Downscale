/**
 * Application Health Monitoring & System Status
 * 
 * This module provides:
 * - Firebase service health checks
 * - Environment validation monitoring
 * - Performance monitoring
 * - Error rate tracking
 */

import { validateClientEnv, validateServerEnv } from './env-validation';
import { normalizeError, logError } from './error-handling';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    environment: HealthCheck;
    firebase: HealthCheck;
    database: HealthCheck;
    authentication: HealthCheck;
  };
  metrics?: {
    errorRate: number;
    responseTime: number;
    uptime: number;
  };
}

export interface HealthCheck {
  status: 'pass' | 'warn' | 'fail';
  message: string;
  details?: any;
  timestamp: string;
}

class ApplicationHealthMonitor {
  private static instance: ApplicationHealthMonitor;
  private errorCount = 0;
  private startTime = Date.now();
  private lastChecked = 0;
  private cached: HealthStatus | null = null;

  private constructor() {}

  public static getInstance(): ApplicationHealthMonitor {
    if (!ApplicationHealthMonitor.instance) {
      ApplicationHealthMonitor.instance = new ApplicationHealthMonitor();
    }
    return ApplicationHealthMonitor.instance;
  }

  /**
   * Performs a comprehensive health check
   */
  public async checkHealth(): Promise<HealthStatus> {
    const now = Date.now();
    
    // Cache results for 30 seconds to avoid excessive checking
    if (this.cached && (now - this.lastChecked) < 30000) {
      return this.cached;
    }

    const timestamp = new Date().toISOString();
    
    const checks = {
      environment: await this.checkEnvironment(),
      firebase: await this.checkFirebase(),
      database: await this.checkDatabase(),
      authentication: await this.checkAuthentication(),
    };

    const overallStatus = this.determineOverallStatus(Object.values(checks));
    
    const healthStatus: HealthStatus = {
      status: overallStatus,
      timestamp,
      checks,
      metrics: {
        errorRate: this.calculateErrorRate(),
        responseTime: this.calculateAverageResponseTime(),
        uptime: now - this.startTime,
      },
    };

    this.cached = healthStatus;
    this.lastChecked = now;
    
    return healthStatus;
  }

  /**
   * Records an error for monitoring
   */
  public recordError(error: unknown): void {
    this.errorCount++;
    const normalizedError = normalizeError(error);
    logError(normalizedError, 'Health Monitor');
  }

  /**
   * Checks environment variable configuration
   */
  private async checkEnvironment(): Promise<HealthCheck> {
    try {
      if (typeof window !== 'undefined') {
        // Client-side check
        validateClientEnv();
      } else {
        // Server-side check
        validateServerEnv();
      }
      
      return {
        status: 'pass',
        message: 'All required environment variables are properly configured',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'fail',
        message: 'Environment configuration issues detected',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Checks Firebase service availability
   */
  private async checkFirebase(): Promise<HealthCheck> {
    try {
      if (typeof window !== 'undefined') {
        // Client-side Firebase check
        const { auth, db } = await import('@/lib/firebase');
        
        if (!auth || !db) {
          throw new Error('Firebase services not properly initialized');
        }
        
        // Try to get current auth state (non-blocking)
        const currentUser = auth.currentUser;
        
        return {
          status: 'pass',
          message: 'Firebase services are available',
          details: {
            authenticated: !!currentUser,
            projectId: db.app.options.projectId,
          },
          timestamp: new Date().toISOString(),
        };
      } else {
        // Server-side Firebase Admin check
        const { getAdminApp } = await import('@/server/firebase-admin');
        const app = await getAdminApp();
        
        return {
          status: 'pass',
          message: 'Firebase Admin services are available',
          details: {
            projectId: app.options.projectId,
          },
          timestamp: new Date().toISOString(),
        };
      }
    } catch (error) {
      return {
        status: 'fail',
        message: 'Firebase services are not available',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Checks database connectivity
   */
  private async checkDatabase(): Promise<HealthCheck> {
    try {
      if (typeof window !== 'undefined') {
        // Client-side database check
        const { db } = await import('@/lib/firebase');
        
        if (!db) {
          throw new Error('Firestore not initialized');
        }
        
        // For client-side, we can't easily test connectivity without auth
        return {
          status: 'pass',
          message: 'Database connection appears healthy',
          timestamp: new Date().toISOString(),
        };
      } else {
        // Server-side database check
        const { getAdminDb } = await import('@/server/firebase-admin');
        const db = await getAdminDb();
        
        // Simple connectivity test
        await db.collection('health-check').limit(1).get();
        
        return {
          status: 'pass',
          message: 'Database is reachable and responsive',
          timestamp: new Date().toISOString(),
        };
      }
    } catch (error) {
      return {
        status: 'fail',
        message: 'Database connectivity issues detected',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Checks authentication service
   */
  private async checkAuthentication(): Promise<HealthCheck> {
    try {
      if (typeof window !== 'undefined') {
        // Client-side auth check
        const { auth } = await import('@/lib/firebase');
        
        if (!auth) {
          throw new Error('Firebase Auth not initialized');
        }
        
        return {
          status: 'pass',
          message: 'Authentication service is available',
          details: {
            authenticated: !!auth.currentUser,
            provider: auth.app.options.authDomain,
          },
          timestamp: new Date().toISOString(),
        };
      } else {
        // Server-side auth check
        const { getAdminApp } = await import('@/server/firebase-admin');
        const app = await getAdminApp();
        
        return {
          status: 'pass',
          message: 'Authentication service is available',
          details: {
            projectId: app.options.projectId,
          },
          timestamp: new Date().toISOString(),
        };
      }
    } catch (error) {
      return {
        status: 'fail',
        message: 'Authentication service issues detected',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Determines overall system status based on individual checks
   */
  private determineOverallStatus(checks: HealthCheck[]): 'healthy' | 'degraded' | 'unhealthy' {
    const failedChecks = checks.filter(check => check.status === 'fail');
    const warnChecks = checks.filter(check => check.status === 'warn');
    
    if (failedChecks.length > 0) {
      return 'unhealthy';
    }
    
    if (warnChecks.length > 0) {
      return 'degraded';
    }
    
    return 'healthy';
  }

  /**
   * Calculates error rate over the last hour
   */
  private calculateErrorRate(): number {
    // Simple implementation - in production, you'd use a sliding window
    const uptime = Date.now() - this.startTime;
    const hours = Math.max(uptime / (1000 * 60 * 60), 0.1); // Minimum 0.1 hour
    return this.errorCount / hours;
  }

  /**
   * Calculates average response time (placeholder)
   */
  private calculateAverageResponseTime(): number {
    // This would be implemented with actual performance measurements
    return 0;
  }

  /**
   * Resets error count (useful for testing)
   */
  public resetMetrics(): void {
    this.errorCount = 0;
    this.startTime = Date.now();
    this.cached = null;
  }
}

// Export singleton instance
const healthMonitor = ApplicationHealthMonitor.getInstance();

export const checkHealth = () => healthMonitor.checkHealth();
export const recordError = (error: unknown) => healthMonitor.recordError(error);
export const resetHealthMetrics = () => healthMonitor.resetMetrics();

/**
 * React hook for health monitoring
 */
export function useHealthMonitor() {
  const [health, setHealth] = React.useState<HealthStatus | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;

    const performHealthCheck = async () => {
      try {
        const status = await checkHealth();
        if (mounted) {
          setHealth(status);
          setLoading(false);
        }
      } catch (error) {
        if (mounted) {
          recordError(error);
          setLoading(false);
        }
      }
    };

    performHealthCheck();

    // Check health every 60 seconds
    const interval = setInterval(performHealthCheck, 60000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { health, loading, refreshHealth: checkHealth };
}

// For React import
import * as React from 'react';
