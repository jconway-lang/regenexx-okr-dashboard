# Regenexx OKR Dashboard - Deployment Guide

This guide will help you deploy your OKR dashboard with authentication to the web.

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended - Easiest)
- Free tier available
- Automatic deployments
- Built-in authentication support
- 5-minute setup

### Option 2: Netlify
- Free tier available
- Easy deployment
- Requires Auth0 setup

### Option 3: AWS Amplify
- More complex setup
- Enterprise features
- AWS Cognito integration

## 📋 Prerequisites

1. **GitHub Account** (for code hosting)
2. **Vercel Account** (free at vercel.com)
3. **Google/Microsoft Developer Account** (for SSO)

## 🎯 Step-by-Step Deployment

### Step 1: Set Up Authentication Providers

#### Google OAuth Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://your-domain.vercel.app/api/auth/callback/google` (for production)
7. Copy Client ID and Client Secret

#### Microsoft Azure AD Setup:
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Click "New registration"
4. Set redirect URI to:
   - `http://localhost:3000/api/auth/callback/azure-ad` (for development)
   - `https://your-domain.vercel.app/api/auth/callback/azure-ad` (for production)
5. Copy Application (client) ID, Directory (tenant) ID
6. Create a client secret and copy it

### Step 2: Prepare Your Code

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Create Environment File:**
   ```bash
   cp env.example .env.local
   ```

3. **Update Environment Variables:**
   ```bash
   # Edit .env.local with your actual values
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-random-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   AZURE_AD_CLIENT_ID=your-azure-client-id
   AZURE_AD_CLIENT_SECRET=your-azure-client-secret
   AZURE_AD_TENANT_ID=your-azure-tenant-id
   ```

4. **Test Locally:**
   ```bash
   npm run dev
   ```

### Step 3: Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/regenexx-okr-dashboard.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Configure Environment Variables in Vercel:**
   - Go to your project dashboard
   - Navigate to "Settings" → "Environment Variables"
   - Add all variables from your `.env.local` file
   - Update `NEXTAUTH_URL` to your Vercel domain
   - Redeploy

### Step 4: Update Redirect URIs

After deployment, update your OAuth providers with the production URLs:

- **Google:** Add `https://your-domain.vercel.app/api/auth/callback/google`
- **Microsoft:** Add `https://your-domain.vercel.app/api/auth/callback/azure-ad`

## 🔧 Alternative: Simple Password Protection

If you prefer simple password protection instead of SSO:

### Option A: Vercel Password Protection
1. In Vercel dashboard, go to "Settings" → "Password Protection"
2. Enable password protection
3. Set a password for your domain

### Option B: Basic Auth Middleware
Create `middleware.ts` in your project root:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get('authorization')
  const url = request.nextUrl

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    if (user === 'admin' && pwd === 'your-password') {
      return NextResponse.next()
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
```

## 🌐 Custom Domain (Optional)

1. **In Vercel Dashboard:**
   - Go to "Settings" → "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment Variables:**
   - Update `NEXTAUTH_URL` to your custom domain
   - Update OAuth redirect URIs

## 🔒 Security Considerations

1. **Environment Variables:** Never commit `.env.local` to Git
2. **Secrets:** Use strong, random secrets for `NEXTAUTH_SECRET`
3. **HTTPS:** Vercel provides HTTPS by default
4. **Domain Restrictions:** Consider restricting OAuth to specific domains

## 📊 Monitoring & Analytics

1. **Vercel Analytics:** Built-in performance monitoring
2. **Google Analytics:** Add GA4 for user analytics
3. **Error Tracking:** Consider Sentry for error monitoring

## 🆘 Troubleshooting

### Common Issues:
1. **Authentication Errors:** Check redirect URIs and environment variables
2. **Build Failures:** Ensure all dependencies are installed
3. **Domain Issues:** Verify DNS settings for custom domains

### Support:
- [Vercel Documentation](https://vercel.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🎉 Success!

Your Regenexx OKR Dashboard is now deployed with authentication! Users can sign in with Google or Microsoft accounts to access the dashboard.
