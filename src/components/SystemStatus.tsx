'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useHealthMonitor, type HealthStatus, type HealthCheck } from '@/lib/health-monitor';
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, Activity, Clock, TrendingUp } from 'lucide-react';

interface SystemStatusProps {
  showDetails?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

function getStatusIcon(status: 'pass' | 'warn' | 'fail') {
  switch (status) {
    case 'pass':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'warn':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'fail':
      return <XCircle className="h-4 w-4 text-red-500" />;
  }
}

function getStatusColor(status: 'healthy' | 'degraded' | 'unhealthy') {
  switch (status) {
    case 'healthy':
      return 'bg-green-500';
    case 'degraded':
      return 'bg-yellow-500';
    case 'unhealthy':
      return 'bg-red-500';
  }
}

function formatUptime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

function HealthCheckCard({ title, check }: { title: string; check: HealthCheck }) {
  return (
    <Card className="bg-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {getStatusIcon(check.status)}
          {title}
          <Badge 
            variant={check.status === 'pass' ? 'default' : check.status === 'warn' ? 'secondary' : 'destructive'}
            className="ml-auto"
          >
            {check.status === 'pass' ? 'Healthy' : check.status === 'warn' ? 'Warning' : 'Failed'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-2">{check.message}</p>
        {check.details && (
          <details className="text-xs">
            <summary className="cursor-pointer text-muted-foreground">Details</summary>
            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
              {JSON.stringify(check.details, null, 2)}
            </pre>
          </details>
        )}
        <div className="text-xs text-muted-foreground mt-2">
          Last checked: {new Date(check.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}

export function SystemStatus({ showDetails = true, autoRefresh = true, refreshInterval = 60000 }: SystemStatusProps) {
  const { health, loading, refreshHealth } = useHealthMonitor();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshHealth();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 animate-spin" />
          <span>Checking system health...</span>
        </div>
      </div>
    );
  }

  if (!health) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          Unable to determine system health. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(health.status)}`} />
            System Status
            <Badge 
              variant={health.status === 'healthy' ? 'default' : health.status === 'degraded' ? 'secondary' : 'destructive'}
              className="ml-auto"
            >
              {health.status === 'healthy' ? 'All Systems Operational' : 
               health.status === 'degraded' ? 'Partial Outage' : 'Service Disruption'}
            </Badge>
          </CardTitle>
          <CardDescription>
            Last updated: {new Date(health.timestamp).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              System has been operational
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Metrics */}
      {health.metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium">Uptime</div>
                  <div className="text-sm text-muted-foreground">
                    {formatUptime(health.metrics.uptime)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="font-medium">Error Rate</div>
                  <div className="text-sm text-muted-foreground">
                    {health.metrics.errorRate.toFixed(2)} errors/hour
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">Response Time</div>
                  <div className="text-sm text-muted-foreground">
                    {health.metrics.responseTime}ms avg
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Health Checks */}
      {showDetails && (
        <>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-4">Service Health Checks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <HealthCheckCard title="Environment" check={health.checks.environment} />
              <HealthCheckCard title="Firebase Services" check={health.checks.firebase} />
              <HealthCheckCard title="Database" check={health.checks.database} />
              <HealthCheckCard title="Authentication" check={health.checks.authentication} />
            </div>
          </div>
        </>
      )}

      {/* Status Summary */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {health.status === 'healthy' && 'All services are running normally.'}
              {health.status === 'degraded' && 'Some services are experiencing issues.'}
              {health.status === 'unhealthy' && 'Critical services are down.'}
            </p>
            {health.status !== 'healthy' && (
              <p className="text-sm text-muted-foreground mt-2">
                We are aware of the issue and working to resolve it.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SystemStatus;
