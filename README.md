# NextOpenImpact 4.0

A modern Next.js application built for creating positive impact through innovative technology and community-driven solutions.

## 🚀 Features

- **Modern Architecture**: Built with Next.js 14 and React 18
- **TypeScript Support**: Full type safety and better developer experience
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **API Routes**: RESTful API endpoints built into the application
- **Vercel Ready**: Optimized for seamless Vercel deployment
- **Performance Optimized**: Server-side rendering and automatic code splitting

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Package Manager**: npm

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/stewartDMS/NextOpenImpact4.0.git
   cd NextOpenImpact4.0
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

4. **Configure Authentication** (Important):
   
   a. Generate a secure NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```
   
   b. Update `.env.local` with the generated secret:
   ```bash
   NEXTAUTH_SECRET="your-generated-secret-here"
   ```
   
   c. Configure OAuth provider(s) - for Google:
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID and Client Secret to `.env.local`
   
   ```bash
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/                  # Next.js 13+ App Router
│   ├── api/             # API routes
│   ├── about/           # About page
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # Reusable React components
├── public/              # Static assets
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## 🚀 Deployment

### Deploy to Vercel

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

#### Environment Variables for Production

**Critical:** Set these environment variables in your Vercel project settings:

1. **NEXTAUTH_URL** (Required for Production & Preview) - Your deployment domain
   
   For **Production** environment:
   ```
   https://your-domain.vercel.app
   ```
   Or use your custom domain if configured.
   
   For **Preview** environment (optional but recommended):
   - You can set it to your main domain, or
   - Omit it entirely - the app will automatically use `VERCEL_URL`
   
2. **NEXTAUTH_SECRET** (Required) - Generate a secure secret
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and add it as the value for `NEXTAUTH_SECRET` in Vercel.
   
   **Important:** Use the **same secret** for all environments (Production, Preview, Development) 
   to maintain session compatibility. If you use different secrets, users will be logged out 
   when switching between environments.

3. **OAuth Credentials** (Required) - Configure for your production domain
   
   Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - Create or edit your OAuth 2.0 Client
   - Add authorized redirect URIs for **each environment**:
     - Production: `https://your-domain.vercel.app/api/auth/callback/google`
     - Preview (optional): `https://your-preview-url.vercel.app/api/auth/callback/google`
     - Development: `http://localhost:3000/api/auth/callback/google`
   - Copy the Client ID and Client Secret
   - Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Vercel environment variables

**How to set environment variables in Vercel:**

1. Go to your project dashboard on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with appropriate values
4. Select which environments it applies to (Production, Preview, Development)
5. Save and redeploy your application

**Important Notes:**
- Environment variables are only loaded during build time and runtime
- After adding or changing environment variables, you must **redeploy** your application
- For preview deployments, Vercel automatically provides `VERCEL_URL` which the app can use if `NEXTAUTH_URL` is not set
- Always use HTTPS in production (Vercel provides this automatically)

#### Deployment Steps

1. Push your code to a Git repository
2. Import your repository to Vercel
3. Configure environment variables (see above)
4. Vercel will automatically detect Next.js and configure the build settings
5. Your app will be deployed and available at a Vercel URL

**Note:** For preview deployments, the app will automatically use `VERCEL_URL` if `NEXTAUTH_URL` is not explicitly set.

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server  
- `npm run lint` - Run ESLint

## 🔧 Troubleshooting

### Authentication Issues

**Problem: User stays on landing page after login**

**Causes & Solutions:**
1. **Missing NEXTAUTH_SECRET**
   - Generate a secret: `openssl rand -base64 32`
   - Add it to `.env.local` (development) or Vercel environment variables (production)

2. **Incorrect NEXTAUTH_URL**
   - Development: Should be `http://localhost:3000`
   - Production: Should match your actual domain (e.g., `https://your-app.vercel.app`)
   - Check that it doesn't have trailing slashes

3. **OAuth redirect URI mismatch**
   - Verify that your OAuth provider's redirect URI matches: `https://your-domain/api/auth/callback/google`
   - The domain must exactly match your NEXTAUTH_URL

4. **Session not persisting**
   - Clear browser cookies and try again
   - Verify NEXTAUTH_SECRET is set and identical across all environments
   - Check browser console for errors

**Problem: OAuth callback fails**

**Solution:**
- Ensure OAuth redirect URIs are correctly configured in your OAuth provider (Google Cloud Console)
- Verify NEXTAUTH_URL is set correctly
- Check that your domain uses HTTPS in production

### Vercel Deployment Issues

**Problem: Environment variables not working**

**Solution:**
- After setting environment variables in Vercel, you must **redeploy** the application
- Go to Deployments → Click the three dots → Redeploy

**Problem: Preview deployments have different URLs**

**Solution:**
- For preview deployments, you can either:
  - Set NEXTAUTH_URL to your main production domain in preview environment
  - Omit NEXTAUTH_URL (the app will automatically use VERCEL_URL)
  - Add all preview URLs to your OAuth redirect URIs (not recommended)

For more details, see [AUTHENTICATION_FLOW.md](./AUTHENTICATION_FLOW.md)

## 🎯 API Endpoints

- `GET /api/hello` - Welcome message and system info
- `POST /api/hello` - Echo received data with timestamp

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you have any questions or run into issues, please open an issue on GitHub.

---

Built with ❤️ using Next.js and deployed on Vercel.