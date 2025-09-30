# Authentication Flow Documentation

This document explains how authentication works in NextOpenImpact 4.0, including the login flow, route protection, and session management.

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
    redirect: ...,                      // Post-login redirect logic
    session: ...,                       // Session customization
  }
}
```

**Key Points:**
- `NEXTAUTH_SECRET` is **required** for session token encryption
- Redirect callback determines where users go after login (default: `/dashboard`)
- Session callback adds custom fields (like `accountType`) to the session

### 2. Middleware (`middleware.ts`)

Server-side route protection that runs **before** page rendering:

```typescript
export { default } from 'next-auth/middleware'

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

The application includes comprehensive logging:

1. **NextAuth logs:** Check server console for `🔧 NextAuth Environment Configuration`
2. **Routing logs:** Check browser console for `🔍 ROUTING DIAGNOSTIC` messages
3. **Dashboard logs:** Check for `DASHBOARD PAGE SESSION:` messages

### Configuration Checker

The app includes a configuration checker that runs on startup:
- Validates environment variables
- Checks for common misconfigurations
- Provides recommendations

Look for `🔍 CONFIGURATION CHECK:` in the console.

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
