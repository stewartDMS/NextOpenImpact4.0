/**
 * Environment Configuration Checker
 * 
 * This utility validates environment variables and provides clear guidance
 * on fixing configuration issues that could cause routing problems.
 */

interface ConfigValidation {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
}

interface DeploymentContext {
  environment: 'development' | 'production' | 'preview' | 'unknown';
  platform: 'vercel' | 'local' | 'other';
  baseUrl: string;
}

class ConfigChecker {
  
  /**
   * Determines the current deployment context
   */
  getDeploymentContext(): DeploymentContext {
    const nodeEnv = process.env.NODE_ENV;
    const vercelEnv = process.env.VERCEL_ENV;
    const vercelUrl = process.env.VERCEL_URL;
    
    let environment: DeploymentContext['environment'] = 'unknown';
    let platform: DeploymentContext['platform'] = 'other';
    let baseUrl = 'http://localhost:3000';

    // Determine platform
    if (vercelUrl || vercelEnv) {
      platform = 'vercel';
    } else if (nodeEnv === 'development') {
      platform = 'local';
    }

    // Determine environment
    if (vercelEnv === 'production') {
      environment = 'production';
      baseUrl = `https://${vercelUrl}`;
    } else if (vercelEnv === 'preview') {
      environment = 'preview';
      baseUrl = `https://${vercelUrl}`;
    } else if (nodeEnv === 'development') {
      environment = 'development';
      baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    }

    return { environment, platform, baseUrl };
  }

  /**
   * Validates all critical environment variables
   */
  validateConfiguration(): ConfigValidation {
    const issues: string[] = [];
    const recommendations: string[] = [];
    const context = this.getDeploymentContext();

    // Validate NEXTAUTH_URL
    this.validateNextAuthUrl(context, issues, recommendations);
    
    // Validate API URL
    this.validateApiUrl(context, issues, recommendations);
    
    // Validate OAuth credentials
    this.validateOAuthConfig(context, issues, recommendations);
    
    // Validate environment consistency
    this.validateEnvironmentConsistency(context, issues, recommendations);

    return {
      isValid: issues.length === 0,
      issues,
      recommendations
    };
  }

  private validateNextAuthUrl(
    context: DeploymentContext, 
    issues: string[], 
    recommendations: string[]
  ): void {
    const nextAuthUrl = process.env.NEXTAUTH_URL;

    if (!nextAuthUrl) {
      issues.push('NEXTAUTH_URL is not set');
      recommendations.push('Set NEXTAUTH_URL environment variable');
      return;
    }

    // Check for localhost in production
    if (context.environment === 'production' && nextAuthUrl.includes('localhost')) {
      issues.push('NEXTAUTH_URL contains localhost in production environment');
      recommendations.push('Update NEXTAUTH_URL to use production domain');
    }

    // Check for HTTP in production
    if (context.environment === 'production' && nextAuthUrl.startsWith('http:')) {
      issues.push('NEXTAUTH_URL uses HTTP in production (should use HTTPS)');
      recommendations.push('Update NEXTAUTH_URL to use HTTPS for production');
    }

    // Check URL format
    try {
      new URL(nextAuthUrl);
    } catch {
      issues.push('NEXTAUTH_URL is not a valid URL');
      recommendations.push('Ensure NEXTAUTH_URL is a properly formatted URL');
    }
  }

  private validateApiUrl(
    context: DeploymentContext, 
    issues: string[], 
    recommendations: string[]
  ): void {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      issues.push('NEXT_PUBLIC_API_URL is not set');
      recommendations.push('Set NEXT_PUBLIC_API_URL environment variable');
      return;
    }

    // Check for localhost in production
    if (context.environment === 'production' && apiUrl.includes('localhost')) {
      issues.push('NEXT_PUBLIC_API_URL contains localhost in production');
      recommendations.push('Update NEXT_PUBLIC_API_URL to use production domain or relative paths');
    }

    // Recommend relative paths for API calls
    if (apiUrl.startsWith('http')) {
      recommendations.push('Consider using relative paths for API calls (e.g., "/api") instead of absolute URLs for better portability');
    }
  }

  private validateOAuthConfig(
    context: DeploymentContext, 
    issues: string[], 
    recommendations: string[]
  ): void {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!googleClientId || googleClientId === 'your-google-client-id') {
      issues.push('Google OAuth Client ID is not properly configured');
      recommendations.push('Configure GOOGLE_CLIENT_ID with actual Google OAuth credentials');
    }

    if (!googleClientSecret || googleClientSecret === 'your-google-client-secret') {
      issues.push('Google OAuth Client Secret is not properly configured');
      recommendations.push('Configure GOOGLE_CLIENT_SECRET with actual Google OAuth credentials');
    }

    if (context.environment === 'production' && (!googleClientId || !googleClientSecret)) {
      issues.push('OAuth credentials missing in production environment');
      recommendations.push('Ensure OAuth credentials are set in production environment variables');
    }
  }

  private validateEnvironmentConsistency(
    context: DeploymentContext, 
    issues: string[], 
    recommendations: string[]
  ): void {
    const nodeEnv = process.env.NODE_ENV;
    const publicEnv = process.env.NEXT_PUBLIC_ENVIRONMENT;

    if (nodeEnv !== publicEnv) {
      issues.push(`Environment mismatch: NODE_ENV=${nodeEnv}, NEXT_PUBLIC_ENVIRONMENT=${publicEnv}`);
      recommendations.push('Ensure NODE_ENV and NEXT_PUBLIC_ENVIRONMENT are consistent');
    }

    // Check for missing NEXTAUTH_SECRET
    const nextAuthSecret = process.env.NEXTAUTH_SECRET;
    if (!nextAuthSecret || nextAuthSecret === 'your-secret-here-replace-in-production') {
      if (context.environment === 'production') {
        issues.push('NEXTAUTH_SECRET is not set or using default value in production');
        recommendations.push('Set a secure NEXTAUTH_SECRET in production environment');
      } else {
        recommendations.push('Set a unique NEXTAUTH_SECRET for better security');
      }
    }
  }

  /**
   * Generates configuration recommendations based on deployment context
   */
  generateConfigurationGuide(): string {
    const context = this.getDeploymentContext();
    const validation = this.validateConfiguration();

    let guide = `# Configuration Guide for ${context.environment} on ${context.platform}\n\n`;
    
    guide += `## Current Context\n`;
    guide += `- Environment: ${context.environment}\n`;
    guide += `- Platform: ${context.platform}\n`;
    guide += `- Base URL: ${context.baseUrl}\n\n`;

    if (validation.issues.length > 0) {
      guide += `## ⚠️ Issues Found\n`;
      validation.issues.forEach((issue, index) => {
        guide += `${index + 1}. ${issue}\n`;
      });
      guide += '\n';
    }

    if (validation.recommendations.length > 0) {
      guide += `## 💡 Recommendations\n`;
      validation.recommendations.forEach((rec, index) => {
        guide += `${index + 1}. ${rec}\n`;
      });
      guide += '\n';
    }

    guide += this.getEnvironmentTemplates(context);

    return guide;
  }

  private getEnvironmentTemplates(context: DeploymentContext): string {
    let templates = `## Environment Variable Templates\n\n`;

    if (context.environment === 'development') {
      templates += `### Development (.env.local)\n\`\`\`\n`;
      templates += `NEXTAUTH_URL="http://localhost:3000"\n`;
      templates += `NEXTAUTH_SECRET="your-development-secret-here"\n`;
      templates += `NEXT_PUBLIC_API_URL="/api"\n`;
      templates += `NEXT_PUBLIC_ENVIRONMENT="development"\n`;
      templates += `GOOGLE_CLIENT_ID="your-google-client-id"\n`;
      templates += `GOOGLE_CLIENT_SECRET="your-google-client-secret"\n`;
      templates += `\`\`\`\n\n`;
    }

    if (context.environment === 'production' || context.platform === 'vercel') {
      templates += `### Production (Vercel Environment Variables)\n\`\`\`\n`;
      templates += `NEXTAUTH_URL="https://your-domain.vercel.app"\n`;
      templates += `NEXTAUTH_SECRET="your-secure-production-secret"\n`;
      templates += `NEXT_PUBLIC_API_URL="/api"\n`;
      templates += `NEXT_PUBLIC_ENVIRONMENT="production"\n`;
      templates += `GOOGLE_CLIENT_ID="your-production-google-client-id"\n`;
      templates += `GOOGLE_CLIENT_SECRET="your-production-google-client-secret"\n`;
      templates += `\`\`\`\n\n`;
    }

    return templates;
  }
}

// Export singleton instance
export const configChecker = new ConfigChecker();

// Convenience function to run full configuration check
export function runConfigurationCheck(): void {
  const context = configChecker.getDeploymentContext();
  const validation = configChecker.validateConfiguration();
  
  console.group('🔧 CONFIGURATION CHECK');
  console.log('Deployment Context:', context);
  
  if (validation.isValid) {
    console.log('✅ Configuration is valid');
  } else {
    console.warn('⚠️ Configuration issues found:');
    validation.issues.forEach(issue => console.warn(`  - ${issue}`));
  }
  
  if (validation.recommendations.length > 0) {
    console.log('💡 Recommendations:');
    validation.recommendations.forEach(rec => console.log(`  - ${rec}`));
  }
  
  console.groupEnd();
}

export default configChecker;