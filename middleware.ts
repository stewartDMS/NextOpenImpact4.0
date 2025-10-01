/**
 * Next.js Middleware for Route Protection
 * 
 * This middleware runs before requests are processed, providing
 * server-side route protection for authenticated routes.
 * 
 * How it works:
 * 1. Intercepts requests to protected routes (defined in matcher)
 * 2. Checks if user has a valid session using NextAuth
 * 3. If authenticated: allows request to proceed
 * 4. If unauthenticated: redirects to sign-in page (configured in NextAuth)
 * 
 * The middleware uses NextAuth's built-in middleware which:
 * - Verifies the session token from cookies
 * - Automatically handles redirects to the configured sign-in page
 * - Preserves the original URL as callbackUrl for post-login redirect
 * 
 * For more information on NextAuth middleware, see:
 * https://next-auth.js.org/configuration/nextjs#middleware
 */

import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  // This function runs after authentication check
  function middleware(req) {
    // Log successful authentication for debugging
    console.log('🔐 Middleware: Authenticated access to:', req.nextUrl.pathname);
    return NextResponse.next();
  },
  {
    callbacks: {
      // This callback determines if the middleware should run
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        const isAuthenticated = !!token;
        
        console.log('🔐 Middleware Authorization Check:');
        console.log('- Path:', path);
        console.log('- Authenticated:', isAuthenticated);
        
        if (!isAuthenticated) {
          console.log('- Result: Redirecting to sign-in page');
        } else {
          console.log('- Result: Access granted');
        }
        
        return isAuthenticated;
      },
    },
  }
);

/**
 * Matcher configuration - specifies which routes this middleware protects
 * 
 * Protected routes:
 * - /dashboard - Main dashboard and all sub-routes
 * 
 * How to add more protected routes:
 * Add additional paths to the matcher array, e.g.:
 * matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*']
 * 
 * Note: The middleware automatically handles redirects to the sign-in page
 * when unauthenticated users try to access protected routes. The sign-in
 * page is configured in the NextAuth configuration (app/api/auth/[...nextauth]/route.ts)
 */
export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
}
