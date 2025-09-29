'use client'

import { useEffect } from 'react'
import { runConfigurationCheck } from '@/lib/config-checker'
import { logEnvironmentDiagnostics } from '@/lib/routing-diagnostics'

/**
 * ConfigurationChecker Component
 * 
 * This component runs configuration validation on app startup
 * and logs diagnostic information to help identify routing issues.
 * It only runs in development or when explicitly enabled.
 */
export function ConfigurationChecker() {
  useEffect(() => {
    // Only run diagnostics in development or when explicitly enabled
    const shouldRunDiagnostics = 
      process.env.NODE_ENV === 'development' || 
      process.env.NEXT_PUBLIC_ENABLE_DIAGNOSTICS === 'true';

    if (shouldRunDiagnostics) {
      console.log('🚀 Starting NextOpenImpact 4.0 with diagnostics enabled');
      
      // Run configuration validation
      runConfigurationCheck();
      
      // Log environment diagnostics
      logEnvironmentDiagnostics();
      
      // Log application startup
      console.group('📱 APPLICATION STARTUP');
      console.log('- Timestamp:', new Date().toISOString());
      console.log('- User Agent:', navigator.userAgent);
      console.log('- Current URL:', window.location.href);
      console.log('- Referrer:', document.referrer || 'Direct access');
      console.groupEnd();
    }
  }, [])

  // This component doesn't render anything
  return null
}

export default ConfigurationChecker