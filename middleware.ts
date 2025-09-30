/**
 * Next.js Middleware for Route Protection
 * 
 * This middleware runs before requests are processed, providing
 * server-side route protection for authenticated routes.
 * 
 * For more information on NextAuth middleware, see:
 * https://next-auth.js.org/configuration/nextjs#middleware
 */

export { default } from 'next-auth/middleware'

/**
 * Matcher configuration - specifies which routes this middleware protects
 * 
 * Protected routes:
 * - /dashboard - Main dashboard and all sub-routes
 * 
 * Note: The middleware automatically handles redirects to the sign-in page
 * when unauthenticated users try to access protected routes.
 */
export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
}
