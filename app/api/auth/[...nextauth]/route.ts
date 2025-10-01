import NextAuth, { DefaultSession, Session } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

/**
 * NextAuth Type Declarations
 * 
 * Extend the default session type to include custom user properties.
 * This allows us to add accountType and other custom fields to the session.
 */
declare module "next-auth" {
  interface Session {
    user: {
      accountType?: string;
    } & DefaultSession["user"]
  }
}

/**
 * Get the correct base URL for the current environment
 * 
 * Priority:
 * 1. NEXTAUTH_URL if explicitly set (recommended for all environments)
 * 2. VERCEL_URL for Vercel deployments (preview and production)
 * 3. localhost:3000 for local development
 * 
 * @returns The base URL for the application
 */
function getBaseUrl() {
  // Use NEXTAUTH_URL if explicitly set (highest priority)
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // For Vercel deployments (both preview and production), use VERCEL_URL
  if (process.env.VERCEL_URL) {
    // VERCEL_URL doesn't include protocol, so add https://
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Fallback to localhost for development
  return 'http://localhost:3000';
}

// Log environment configuration for debugging
console.log('🔧 NextAuth Environment Configuration:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('- VERCEL_URL:', process.env.VERCEL_URL);
console.log('- VERCEL_ENV:', process.env.VERCEL_ENV);
console.log('- Computed Base URL:', getBaseUrl());

/**
 * NextAuth Configuration
 * 
 * This configures authentication for the application.
 * Key features:
 * - Google OAuth provider for sign-in
 * - Custom redirect handling for post-authentication flow
 * - Session customization to include user account type
 * - Middleware protection for dashboard routes (see middleware.ts)
 * 
 * Environment Variables Required:
 * - NEXTAUTH_SECRET: Secret for JWT encryption (generate with: openssl rand -base64 32)
 * - NEXTAUTH_URL: Application URL (auto-detected from VERCEL_URL in production)
 * - GOOGLE_CLIENT_ID: Google OAuth client ID
 * - GOOGLE_CLIENT_SECRET: Google OAuth client secret
 */
const authOptions = {
  // Secret for session token encryption - REQUIRED for production
  // Without this, sessions will not persist and users will stay logged out
  secret: process.env.NEXTAUTH_SECRET,
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  
  // Custom sign-in page (landing page with auth modal)
  pages: {
    signIn: '/',
  },
  
  callbacks: {
    /**
     * Redirect callback - determines where to send users after sign in
     * 
     * This callback is crucial for the authentication flow:
     * 1. After successful OAuth, user is redirected via this callback
     * 2. We check if the URL is relative or absolute
     * 3. Default behavior: redirect to /dashboard
     * 
     * IMPORTANT: NextAuth expects relative paths (e.g., "/dashboard") for same-domain redirects.
     * Returning full URLs can cause redirect issues in some environments.
     * 
     * @param url - URL to redirect to (provided by NextAuth or callbackUrl param)
     * @param baseUrl - Base URL of the application (auto-detected by NextAuth)
     * @returns Path to redirect the user to (relative path for same-domain)
     */
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      const computedBaseUrl = getBaseUrl();
      
      console.log('🔄 NextAuth Redirect Callback:');
      console.log('- Requested URL:', url);
      console.log('- NextAuth Base URL:', baseUrl);
      console.log('- Computed Base URL:', computedBaseUrl);
      
      // If URL is already relative (starts with /), return it as-is
      if (url.startsWith('/')) {
        console.log('- Relative URL detected, using:', url);
        return url;
      }
      
      // If URL is from our domain (starts with baseUrl or computedBaseUrl), 
      // extract the path and return it as a relative URL
      if (url.startsWith(baseUrl)) {
        const path = url.substring(baseUrl.length) || '/dashboard';
        console.log('- Same domain URL (baseUrl), extracting path:', path);
        return path;
      }
      
      if (url.startsWith(computedBaseUrl)) {
        const path = url.substring(computedBaseUrl.length) || '/dashboard';
        console.log('- Same domain URL (computedBaseUrl), extracting path:', path);
        return path;
      }
      
      // For external URLs or unrecognized patterns, redirect to dashboard
      // This is a security measure to prevent open redirects
      console.log('- External or unrecognized URL, defaulting to /dashboard');
      return '/dashboard';
    },
    
    /**
     * Session callback - customize the session object
     * 
     * This is called whenever a session is checked (on every request).
     * Use it to add custom data to the session that pages can access.
     * 
     * @param session - The session object
     * @returns Modified session object
     */
    async session({ session }: { session: Session }): Promise<Session> {
      // Add additional user info to session if needed
      if (session?.user) {
        // Default to 'general' account type if not specified
        session.user.accountType = session.user.accountType || 'general';
      }
      return session;
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
