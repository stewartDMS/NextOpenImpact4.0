# Testing the Authentication Flow

This document provides step-by-step instructions for testing the authentication flow locally and in production.

## Prerequisites

Before testing, ensure you have:
1. ✅ Node.js 18+ installed
2. ✅ npm installed
3. ✅ Google OAuth credentials (or other OAuth provider)
4. ✅ Generated NEXTAUTH_SECRET

## Local Development Testing

### Step 1: Environment Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and add it to `.env.local`

3. **Configure Google OAuth:**
   
   a. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   
   b. Create a new OAuth 2.0 Client ID (or use existing)
   
   c. Add authorized redirect URI:
      ```
      http://localhost:3000/api/auth/callback/google
      ```
   
   d. Copy Client ID and Client Secret to `.env.local`:
      ```
      GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
      GOOGLE_CLIENT_SECRET="GOCSPX-your-client-secret"
      ```

4. **Your complete `.env.local` should look like:**
   ```env
   NEXT_PUBLIC_APP_NAME="NextOpenImpact 4.0"
   NEXT_PUBLIC_APP_VERSION="4.0.0"
   NEXT_PUBLIC_ENVIRONMENT="development"
   NEXT_PUBLIC_API_URL="/api"
   
   DATABASE_URL="file:./dev.db"
   
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-generated-secret-from-step-2"
   
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   NEXT_PUBLIC_ENABLE_DIAGNOSTICS="true"
   ```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

The server should start at http://localhost:3000

### Step 4: Test Authentication Flow

#### Test 1: Access Public Pages
- ✅ Navigate to http://localhost:3000
- ✅ Should see landing page with "Sign In" button
- ✅ No redirect should occur

#### Test 2: Protected Route (Unauthenticated)
- ✅ Navigate to http://localhost:3000/dashboard
- ✅ Should be redirected to home page (/)
- ✅ Should stay on home page with "Sign In" button visible

#### Test 3: Sign In Flow
1. ✅ Click "Sign In" button on home page
2. ✅ Auth modal should open with Google sign-in option
3. ✅ Click "Sign in with Google"
4. ✅ Google OAuth popup/redirect should appear
5. ✅ Authorize the application
6. ✅ Should be redirected to http://localhost:3000/dashboard
7. ✅ Dashboard should render with your user information

#### Test 4: Session Persistence
1. ✅ While logged in at dashboard, refresh the page
2. ✅ Should remain logged in and see dashboard
3. ✅ Check browser console for session logs:
   ```
   DASHBOARD PAGE SESSION: { user: { ... }, ... } STATUS: authenticated
   ```

#### Test 5: Navigation While Authenticated
1. ✅ Navigate to home page (/)
2. ✅ Should see user avatar/name in navigation (not "Sign In")
3. ✅ Navigate back to /dashboard
4. ✅ Should see dashboard without redirect

#### Test 6: Sign Out
1. ✅ Click user avatar in navigation
2. ✅ Click "Sign out"
3. ✅ Should be signed out
4. ✅ Navigation should show "Sign In" button again

#### Test 7: Protected Route (After Sign Out)
1. ✅ Try to navigate to http://localhost:3000/dashboard
2. ✅ Should be redirected to home page
3. ✅ Should not see dashboard content

### Expected Console Logs

When everything is working correctly, you should see:

**Server Console:**
```
🔧 NextAuth Environment Configuration:
- NODE_ENV: development
- NEXTAUTH_URL: http://localhost:3000
- VERCEL_URL: undefined
- VERCEL_ENV: undefined
- Computed Base URL: http://localhost:3000

🔄 NextAuth Redirect Callback:
- Requested URL: /dashboard
- Base URL: http://localhost:3000
- Computed Base URL: http://localhost:3000
- Default redirect to dashboard: http://localhost:3000/dashboard
```

**Browser Console:**
```
DASHBOARD PAGE SESSION: {
  user: {
    name: "Your Name",
    email: "your@email.com",
    image: "...",
    accountType: "general"
  },
  expires: "..."
} STATUS: authenticated
```

## Production Testing (Vercel)

### Step 1: Configure Vercel Environment Variables

In your Vercel project settings, add these environment variables:

```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret-here
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
NEXT_PUBLIC_APP_NAME=NextOpenImpact 4.0
NEXT_PUBLIC_APP_VERSION=4.0.0
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_API_URL=/api
```

### Step 2: Update OAuth Redirect URIs

In Google Cloud Console, add production redirect URI:
```
https://your-domain.vercel.app/api/auth/callback/google
```

### Step 3: Deploy

```bash
git push origin main
```

Vercel will automatically deploy.

### Step 4: Test Production

Follow the same test steps as local development, but use your production URL.

## Troubleshooting

### Issue: Stuck on landing page after login

**Symptoms:**
- Click sign in → Google OAuth → Redirected back to landing page
- Not redirected to dashboard
- No error messages

**Solution:**
1. Check if `NEXTAUTH_SECRET` is set:
   ```bash
   # For local
   grep NEXTAUTH_SECRET .env.local
   
   # For production
   # Check Vercel dashboard → Project Settings → Environment Variables
   ```

2. Regenerate and update `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

3. Restart dev server or redeploy

### Issue: OAuth redirect fails

**Symptoms:**
- Google OAuth shows "redirect_uri_mismatch" error
- OAuth popup closes without completing

**Solution:**
1. Check authorized redirect URIs in Google Cloud Console
2. Ensure exact match with your domain
3. Include `/api/auth/callback/google` path

### Issue: Session not persisting

**Symptoms:**
- Login successful but refresh logs you out
- Dashboard redirects to home immediately

**Solution:**
1. Verify `NEXTAUTH_SECRET` is exactly 32+ characters
2. Check browser cookies (should have `next-auth.session-token`)
3. Ensure `NEXTAUTH_URL` matches your domain exactly

### Issue: Middleware not working

**Symptoms:**
- Can access `/dashboard` without login
- No automatic redirects

**Solution:**
1. Check if `middleware.ts` exists in root directory
2. Verify middleware config exports matcher
3. Rebuild and restart: `npm run build && npm run dev`

## Test Checklist

Use this checklist to verify authentication is working:

- [ ] Environment variables configured (.env.local or Vercel)
- [ ] NEXTAUTH_SECRET generated and set
- [ ] OAuth credentials configured
- [ ] OAuth redirect URIs match environment
- [ ] Development server starts without errors
- [ ] Landing page loads
- [ ] Sign in button visible when logged out
- [ ] OAuth popup opens on sign in
- [ ] Redirected to dashboard after OAuth
- [ ] Dashboard shows user information
- [ ] Session persists on page refresh
- [ ] Navigation shows user avatar when logged in
- [ ] Cannot access /dashboard when logged out
- [ ] Redirected to home when accessing /dashboard without login
- [ ] Sign out works correctly
- [ ] Sign in again works after sign out

## Success Criteria

Authentication is working correctly when:
1. ✅ Users can sign in via OAuth
2. ✅ After successful sign in, users are redirected to dashboard
3. ✅ Dashboard shows user information
4. ✅ Session persists across page refreshes
5. ✅ Protected routes require authentication
6. ✅ Unauthenticated users are redirected from protected routes
7. ✅ Sign out works and clears session
8. ✅ No console errors related to authentication

## Additional Notes

- **First-time setup:** May take 5-10 minutes to configure OAuth
- **Testing time:** Each test run should take 2-3 minutes
- **Browser cache:** Clear cookies if experiencing issues
- **Multiple environments:** Use different OAuth credentials for dev/prod
