/**
 * Routing Diagnostics Utility
 * 
 * This module provides comprehensive logging and debugging capabilities 
 * for investigating dashboard routing issues, environment variable misconfigurations,
 * and deployment URL mismatches.
 */

interface EnvironmentInfo {
  NODE_ENV: string | undefined;
  NEXT_PUBLIC_APP_NAME: string | undefined;
  NEXT_PUBLIC_APP_VERSION: string | undefined;
  NEXT_PUBLIC_ENVIRONMENT: string | undefined;
  NEXT_PUBLIC_API_URL: string | undefined;
  NEXTAUTH_URL: string | undefined;
  VERCEL_URL: string | undefined;
  VERCEL_ENV: string | undefined;
}

interface RoutingEvent {
  timestamp: string;
  event: string;
  path: string;
  referrer: string;
  userAgent: string;
  sessionStatus: string;
  environmentInfo: EnvironmentInfo;
  additionalData?: Record<string, unknown>;
}

class RoutingDiagnostics {
  private isClient: boolean;
  private logBuffer: RoutingEvent[] = [];

  constructor() {
    this.isClient = typeof window !== 'undefined';
  }

  /**
   * Collects current environment variables relevant to routing
   */
  private getEnvironmentInfo(): EnvironmentInfo {
    return {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
      NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
      NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      VERCEL_URL: process.env.VERCEL_URL,
      VERCEL_ENV: process.env.VERCEL_ENV,
    };
  }

  /**
   * Logs a routing event with comprehensive context
   */
  logRoutingEvent(
    event: string, 
    path: string, 
    sessionStatus: string = 'unknown',
    additionalData?: Record<string, unknown>
  ): void {
    const routingEvent: RoutingEvent = {
      timestamp: new Date().toISOString(),
      event,
      path,
      referrer: this.isClient ? document.referrer : 'server',
      userAgent: this.isClient ? navigator.userAgent : 'server',
      sessionStatus,
      environmentInfo: this.getEnvironmentInfo(),
      additionalData,
    };

    this.logBuffer.push(routingEvent);
    
    // Console log with color coding for better visibility
    console.group(`🔍 ROUTING DIAGNOSTIC: ${event}`);
    console.log(`📅 Timestamp: ${routingEvent.timestamp}`);
    console.log(`🛣️  Path: ${path}`);
    console.log(`👤 Session Status: ${sessionStatus}`);
    console.log(`🌐 Environment:`, this.getEnvironmentInfo());
    
    if (additionalData) {
      console.log(`📋 Additional Data:`, additionalData);
    }
    
    console.groupEnd();
  }

  /**
   * Logs environment variable diagnostics
   */
  logEnvironmentDiagnostics(): void {
    const envInfo = this.getEnvironmentInfo();
    
    console.group('🔧 ENVIRONMENT DIAGNOSTICS');
    console.log('Current Environment Variables (routing-related):');
    
    Object.entries(envInfo).forEach(([key, value]) => {
      const status = value ? '✅' : '❌';
      console.log(`${status} ${key}: ${value || 'NOT SET'}`);
    });

    // Check for potential issues
    this.checkEnvironmentIssues(envInfo);
    
    console.groupEnd();
  }

  /**
   * Checks for common environment variable issues
   */
  private checkEnvironmentIssues(envInfo: EnvironmentInfo): void {
    const issues: string[] = [];

    // Check for localhost vs production URL mismatches
    if (envInfo.NEXTAUTH_URL?.includes('localhost') && envInfo.VERCEL_ENV === 'production') {
      issues.push('⚠️ NEXTAUTH_URL contains localhost in production environment');
    }

    if (envInfo.NEXT_PUBLIC_API_URL?.includes('localhost') && envInfo.VERCEL_ENV === 'production') {
      issues.push('⚠️ NEXT_PUBLIC_API_URL contains localhost in production environment');
    }

    // Check for missing critical environment variables
    if (!envInfo.NEXTAUTH_URL) {
      issues.push('❌ NEXTAUTH_URL is not set');
    }

    if (!envInfo.NEXT_PUBLIC_API_URL) {
      issues.push('❌ NEXT_PUBLIC_API_URL is not set');
    }

    // Check for environment mismatch
    if (envInfo.NODE_ENV !== envInfo.NEXT_PUBLIC_ENVIRONMENT) {
      issues.push(`⚠️ Environment mismatch: NODE_ENV=${envInfo.NODE_ENV}, NEXT_PUBLIC_ENVIRONMENT=${envInfo.NEXT_PUBLIC_ENVIRONMENT}`);
    }

    if (issues.length > 0) {
      console.warn('🚨 POTENTIAL ENVIRONMENT ISSUES DETECTED:');
      issues.forEach(issue => console.warn(issue));
    } else {
      console.log('✅ No obvious environment issues detected');
    }
  }

  /**
   * Gets routing event history
   */
  getEventHistory(): RoutingEvent[] {
    return [...this.logBuffer];
  }

  /**
   * Clears the event log
   */
  clearEventHistory(): void {
    this.logBuffer = [];
  }

  /**
   * Analyzes routing patterns for potential issues
   */
  analyzeRoutingPatterns(): void {
    console.group('📊 ROUTING PATTERN ANALYSIS');
    
    const events = this.getEventHistory();
    const pathCounts = events.reduce((acc, event) => {
      acc[event.path] = (acc[event.path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('Most visited paths:', pathCounts);

    // Check for redirect loops
    const redirectEvents = events.filter(e => e.event.includes('redirect'));
    if (redirectEvents.length > 3) {
      console.warn('⚠️ Potential redirect loop detected:', redirectEvents.length, 'redirects');
    }

    // Check for authentication issues
    const authEvents = events.filter(e => e.sessionStatus === 'unauthenticated');
    if (authEvents.length > 0) {
      console.log('🔐 Unauthenticated route attempts:', authEvents.length);
    }

    console.groupEnd();
  }
}

// Export singleton instance
export const routingDiagnostics = new RoutingDiagnostics();

// Convenience functions
export const logRoutingEvent = (
  event: string, 
  path: string, 
  sessionStatus?: string,
  additionalData?: Record<string, unknown>
) => routingDiagnostics.logRoutingEvent(event, path, sessionStatus, additionalData);

export const logEnvironmentDiagnostics = () => routingDiagnostics.logEnvironmentDiagnostics();

export const analyzeRoutingPatterns = () => routingDiagnostics.analyzeRoutingPatterns();