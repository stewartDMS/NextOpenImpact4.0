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
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      const computedBaseUrl = getBaseUrl();
      
      console.log('🔄 NextAuth Redirect Callback:');
      console.log('- Requested URL:', url);
      console.log('- Base URL:', baseUrl);
      console.log('- Computed Base URL:', computedBaseUrl);
      
      // Always redirect to dashboard after successful authentication
      const dashboardUrl = `${computedBaseUrl}/dashboard`;
      
      console.log('- Final redirect URL:', dashboardUrl);
      
      return dashboardUrl;
    },
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
