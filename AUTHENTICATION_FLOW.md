# Authentication Flow Documentation

This document explains how authentication works in NextOpenImpact 4.0, including the login flow, route protection, and session management.

## Recent Updates

**Last Updated:** December 2024

### What's Fixed
- ✅ **Redirect Issue Fixed**: NextAuth redirect callback now returns relative paths (`/dashboard`) instead of full URLs, fixing the issue where users stayed on the landing page after login
- ✅ **Client-Side Redirect Added**: AuthModal now automatically redirects to dashboard when authentication succeeds
- ✅ **Environment Variable Priority Updated**: NEXTAUTH_URL now takes priority over VERCEL_URL for better control
- ✅ **Enhanced Middleware**: Added detailed logging and authorization callbacks for better debugging
- ✅ **Improved Documentation**: Updated README and .env.example with comprehensive Vercel deployment guides

### How It Works Now
1. User clicks "Sign In with Google" in the AuthModal
2. User completes OAuth flow with Google
3. NextAuth redirect callback returns `/dashboard` (relative path)
4. User is redirected to dashboard by NextAuth
5. AuthModal's useEffect detects authentication and ensures client-side redirect as backup
6. Middleware protects dashboard routes and keeps session active

## Overview

The application uses [NextAuth.js](https://next-auth.js.org/) v4 for authentication with the following features:
- **OAuth Authentication**: Google OAuth provider (GitHub can be added)
- **Server-side Route Protection**: Using Next.js middleware
- **Client-side Session Management**: Using NextAuth session hooks
- **Automatic Redirects**: Authenticated users go to dashboard, unauthenticated users to home

## Architecture Components

### 1. NextAuth Configuration (`app/api/auth/[...nextauth]/route.ts`)

This is the core authentication configuration:

```typescript
const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,  // Critical for session encryption
  providers: [GoogleProvider(...)],     // OAuth providers
  pages: { signIn: '/' },               // Custom sign-in page
  callbacks: {
    redirect: ...,                      // Post-login redirect logic (returns relative paths)
    session: ...,                       // Session customization
  }
}
```

**Key Points:**
- `NEXTAUTH_SECRET` is **required** for session token encryption
- Redirect callback returns relative paths (e.g., `/dashboard`) for same-domain redirects
- Session callback adds custom fields (like `accountType`) to the session
- `getBaseUrl()` prioritizes: NEXTAUTH_URL → VERCEL_URL → localhost:3000

### 2. Middleware (`middleware.ts`)

Server-side route protection that runs **before** page rendering:

```typescript
export default withAuth(
  function middleware(req) { /* ... */ },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: ['/dashboard/:path*']  // Protected routes
}
```

**What it does:**
- Checks authentication status before serving protected routes
- Automatically redirects unauthenticated users to sign-in page
- Prevents unauthorized access at the server level

### 3. Session Provider (`components/SessionProvider.tsx`)

Wraps the application to provide session context:

```typescript
<SessionProvider>
  {children}
</SessionProvider>
```

**Used in:** Root layout (`app/layout.tsx`)

### 4. Protected Components

Dashboard pages use `useSession()` to access authentication state:

```typescript
const { data: session, status } = useSession()

if (status === 'loading') {
  return <LoadingSpinner />
}

if (!session) {
  return <LoadingSpinner />  // Middleware handles redirect
}

// Render protected content
```

## Authentication Flow

### 1. User Clicks "Sign In"

```
Landing Page (/) → Click "Sign In" button
                 ↓
          Opens Auth Modal
                 ↓
          Select Google OAuth
```

### 2. OAuth Flow

```
Google OAuth Popup → User authorizes
                   ↓
    Google redirects to: /api/auth/callback/google
                   ↓
         NextAuth validates token
                   ↓
        Creates session (JWT token)
                   ↓
     Redirect callback determines destination
```

### 3. Post-Login Redirect

The redirect callback in NextAuth configuration:

```typescript
async redirect({ url, baseUrl }) {
  // If relative URL (e.g., /dashboard), make it absolute
  if (url.startsWith('/')) {
    return `${computedBaseUrl}${url}`
  }
  
  // If same domain, allow it
  if (url.startsWith(computedBaseUrl)) {
    return url
  }
  
  // Default: redirect to dashboard
  return `${computedBaseUrl}/dashboard`
}
```

**Result:** User lands on `/dashboard` with active session

### 4. Accessing Protected Routes

```
User navigates to /dashboard
            ↓
    Middleware checks session
            ↓
     ┌──────┴──────┐
     ↓             ↓
  Authenticated   Unauthenticated
     ↓             ↓
Render page    Redirect to /
```

### 5. Session Persistence

Sessions are stored as **JWT tokens** in cookies:
- **Cookie name:** `next-auth.session-token` (development) or `__Secure-next-auth.session-token` (production)
- **Encrypted with:** `NEXTAUTH_SECRET`
- **Expires:** Based on NextAuth session strategy (default: 30 days)

## Environment Variables

### Required for Authentication to Work

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXTAUTH_SECRET` | **CRITICAL**: Encrypts session tokens | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Application base URL | `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `GOCSPX-...` |

### Environment-Specific Setup

#### Development (`.env.local`)
```bash
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-local-secret"
GOOGLE_CLIENT_ID="your-dev-client-id"
GOOGLE_CLIENT_SECRET="your-dev-client-secret"
```

#### Production (Vercel Environment Variables)
```bash
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-production-secret"  # Generate with: openssl rand -base64 32
GOOGLE_CLIENT_ID="your-production-client-id"
GOOGLE_CLIENT_SECRET="your-production-client-secret"
```

**Important:** OAuth redirect URIs must match your environment:
- Development: `http://localhost:3000/api/auth/callback/google`
- Production: `https://your-domain.vercel.app/api/auth/callback/google`

## Common Issues and Solutions

### Issue 1: User stays on landing page after login

**Cause:** Missing or incorrect `NEXTAUTH_SECRET`

**Solution:**
```bash
# Generate a secure secret
openssl rand -base64 32

# Add to .env.local (development) or Vercel environment variables (production)
NEXTAUTH_SECRET="generated-secret-here"
```

### Issue 2: Session not persisting

**Causes:**
1. `NEXTAUTH_SECRET` not set or incorrect
2. Cookie domain mismatch
3. HTTPS required in production but not available

**Solutions:**
1. Verify `NEXTAUTH_SECRET` is set correctly
2. Ensure `NEXTAUTH_URL` matches your actual domain
3. Use HTTPS in production (Vercel provides this automatically)

### Issue 3: OAuth redirect fails

**Cause:** OAuth redirect URI mismatch

**Solution:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your OAuth 2.0 Client
3. Add authorized redirect URI: `https://your-domain.vercel.app/api/auth/callback/google`

### Issue 4: Infinite redirect loop

**Cause:** Middleware and page components both trying to redirect

**Solution:** Already fixed! Middleware handles server-side redirects, pages show loading states only.

## Testing Authentication

### Local Testing

1. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

2. **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

3. **Configure Google OAuth:**
   - Create OAuth credentials at https://console.cloud.google.com/apis/credentials
   - Add redirect URI: `http://localhost:3000/api/auth/callback/google`

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Test flow:**
   - Click "Sign In" → Should open Google OAuth
   - Authorize → Should redirect to `/dashboard`
   - Refresh page → Should stay logged in
   - Navigate to `/dashboard` without login → Should redirect to `/`

### Production Testing (Vercel)

1. **Set environment variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add all required variables
   - Redeploy

2. **Test flow:**
   - Same as local testing but on production URL

## Security Best Practices

1. **Never commit secrets:** Use `.env.local` for development, never commit it
2. **Use strong NEXTAUTH_SECRET:** Generate with `openssl rand -base64 32`
3. **Use HTTPS in production:** Required for secure cookies
4. **Rotate secrets periodically:** Update `NEXTAUTH_SECRET` in production every few months
5. **Restrict OAuth credentials:** Only allow authorized redirect URIs

## Debugging

### Enable Debug Logs

The application includes comprehensive logging for debugging authentication issues:

1. **NextAuth Server Logs** (check server console/terminal):
   - `🔧 NextAuth Environment Configuration` - Shows detected environment variables and computed base URL
   - `🔄 NextAuth Redirect Callback` - Shows redirect logic and URL transformations
   
2. **Middleware Logs** (check server console/terminal):
   - `🔐 Middleware Authorization Check` - Shows path being accessed and authentication status
   - Logs whether access is granted or redirecting to sign-in
   
3. **Client-Side Logs** (check browser console):
   - `✅ User authenticated via modal, redirecting to dashboard` - Shows successful authentication in AuthModal
   - `🔍 ROUTING DIAGNOSTIC` - Shows routing events and environment info
   - `DASHBOARD PAGE SESSION` - Shows session data on dashboard pages

4. **Routing Diagnostics** (check browser console):
   - `🔧 ENVIRONMENT DIAGNOSTICS` - Shows all routing-related environment variables
   - Checks for common issues like localhost URLs in production

### Common Debug Scenarios

#### Check if NEXTAUTH_SECRET is set
```bash
# In your terminal/server logs, look for:
🔧 NextAuth Environment Configuration:
- NEXTAUTH_SECRET: [defined/undefined]
```

#### Check redirect behavior
```bash
# After OAuth login, look for:
🔄 NextAuth Redirect Callback:
- Requested URL: http://localhost:3000/dashboard
- NextAuth Base URL: http://localhost:3000
- Computed Base URL: http://localhost:3000
- Same domain URL (baseUrl), extracting path: /dashboard
```

The redirect should return a relative path like `/dashboard`, not a full URL.

#### Check middleware protection
```bash
# When accessing /dashboard, look for:
🔐 Middleware Authorization Check:
- Path: /dashboard
- Authenticated: true
- Result: Access granted
```

### Configuration Checker

The app includes a configuration checker that runs on startup:
- Validates environment variables
- Checks for common misconfigurations
- Provides recommendations

Look for `🔍 CONFIGURATION CHECK:` in the console.

### Debug Checklist

If authentication isn't working, check:

- [ ] `NEXTAUTH_SECRET` is set and is the same across all environments
- [ ] `NEXTAUTH_URL` matches your deployment URL (or is omitted for Vercel with VERCEL_URL)
- [ ] OAuth redirect URIs are configured correctly in Google Cloud Console
- [ ] Server logs show `🔧 NextAuth Environment Configuration` with correct values
- [ ] Redirect callback returns relative paths (e.g., `/dashboard`), not full URLs
- [ ] Browser has cookies enabled and not blocking third-party cookies
- [ ] No console errors in browser or server logs

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Google OAuth Setup](https://console.cloud.google.com/apis/credentials)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## Summary

The authentication system is designed to be:
- **Secure**: Using industry-standard OAuth and JWT tokens
- **Simple**: Minimal configuration required
- **Robust**: Server-side protection with middleware
- **Debuggable**: Comprehensive logging for troubleshooting

The key to making it work is ensuring `NEXTAUTH_SECRET` is properly set in all environments!
