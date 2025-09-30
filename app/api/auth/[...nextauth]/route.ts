import NextAuth, { DefaultSession, Session } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

declare module "next-auth" {
  interface Session {
    user: {
      accountType?: string;
    } & DefaultSession["user"]
  }
}

// Helper function to get the correct URL for the environment
function getBaseUrl() {
  // In production, prefer VERCEL_URL, then NEXTAUTH_URL
  if (process.env.VERCEL_URL && process.env.NODE_ENV === 'production') {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Use NEXTAUTH_URL if explicitly set
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
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

const authOptions = {
  // Secret for session token encryption - REQUIRED for production
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
     * @param url - URL to redirect to (provided by NextAuth)
     * @param baseUrl - Base URL of the application
     * @returns URL to redirect the user to
     */
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      const computedBaseUrl = getBaseUrl();
      
      console.log('🔄 NextAuth Redirect Callback:');
      console.log('- Requested URL:', url);
      console.log('- Base URL:', baseUrl);
      console.log('- Computed Base URL:', computedBaseUrl);
      
      // If the URL is relative (starts with /), use computedBaseUrl as base
      if (url.startsWith('/')) {
        const fullUrl = `${computedBaseUrl}${url}`;
        console.log('- Relative URL detected, redirecting to:', fullUrl);
        return fullUrl;
      }
      
      // If URL is from our domain, allow it
      if (url.startsWith(computedBaseUrl)) {
        console.log('- Same domain URL, allowing:', url);
        return url;
      }
      
      // Default: redirect to dashboard after successful authentication
      const dashboardUrl = `${computedBaseUrl}/dashboard`;
      console.log('- Default redirect to dashboard:', dashboardUrl);
      return dashboardUrl;
    },
    
    /**
     * Session callback - customize the session object
     * This is called whenever a session is checked
     */
    async session({ session }: { session: Session }): Promise<Session> {
      // Add additional user info to session if needed
      if (session?.user) {
        session.user.accountType = session.user.accountType || 'general';
      }
      return session;
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
