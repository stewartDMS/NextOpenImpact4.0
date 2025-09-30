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

1. **NEXTAUTH_URL** - Your production domain
   ```
   https://your-domain.vercel.app
   ```
   
2. **NEXTAUTH_SECRET** - Generate a secure secret
   ```bash
   openssl rand -base64 32
   ```
   Paste the output as the value for `NEXTAUTH_SECRET`

3. **OAuth Credentials** - Configure for your production domain
   - Update OAuth redirect URIs to include your production domain:
     - `https://your-domain.vercel.app/api/auth/callback/google`
   - Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

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