# MedTouch.ai - Vercel Deployment Guide

## Quick Start Deployment

### Method 1: Direct Vercel Deployment (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to project directory**:
   ```bash
   cd medtouch-app
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No
   - Project name: medtouch-ai (or your choice)
   - Directory: ./
   - Override settings: No

5. **Production Deployment**:
   ```bash
   vercel --prod
   ```

Your app will be live at: `https://your-project-name.vercel.app`

### Method 2: GitHub + Vercel Dashboard

1. **Create a GitHub Repository**:
   - Go to github.com
   - Create new repository: `medtouch-ai`
   - Don't initialize with README (we have one)

2. **Push code to GitHub**:
   ```bash
   cd medtouch-app
   git init
   git add .
   git commit -m "Initial commit: MedTouch.ai medical triage system"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/medtouch-ai.git
   git push -u origin main
   ```

3. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel auto-detects Next.js settings
   - Click "Deploy"

## Project Structure Verification

Before deploying, ensure you have these files:

```
medtouch-app/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── SplashScreen.tsx
│   ├── LoginScreen.tsx
│   ├── WelcomeScreen.tsx
│   ├── VitalsScreen.tsx
│   ├── SymptomsScreen.tsx
│   ├── MedicalHistoryScreen.tsx
│   ├── ReviewScreen.tsx
│   └── RiskPredictionScreen.tsx
├── public/
│   └── data/
│       └── patients.csv
├── utils/
│   └── translations.ts
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.json
└── vercel.json
```

## Environment Configuration

No environment variables needed for basic deployment!

## Build & Test Locally

Before deploying, test the build:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test production build
npm start
```

Open http://localhost:3000 to verify everything works.

## Common Issues & Solutions

### Issue 1: Module Not Found Errors

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue 2: TypeScript Errors

**Solution**: 
Check all imports in component files match exact file names (case-sensitive).

### Issue 3: CSV File Not Loading

**Solution**: 
Ensure `/public/data/patients.csv` exists. The file path in code is `/data/patients.csv` (public is implicit).

### Issue 4: Icons Not Showing (Wifi Error)

**Solution**: 
This error is already fixed! All imports now use correct lucide-react icon names:
- ✅ `Watch` instead of `Wifi`
- ✅ `Activity`, `Heart`, `Thermometer`, etc.

## Performance Optimization

The app includes:
- ✅ Server-side rendering
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ CSS minification
- ✅ Tree shaking

## Post-Deployment

After successful deployment:

1. **Test all features**:
   - Login with: PT2026000000 / abcd
   - Test language switching
   - Try demo mode
   - Test voice input (requires HTTPS)
   - Upload a document
   - Complete full flow

2. **Custom Domain** (optional):
   - Go to Vercel dashboard
   - Select your project
   - Settings → Domains
   - Add your custom domain

3. **Analytics** (optional):
   - Vercel provides built-in analytics
   - Enable in project settings

## Voice Input Requirements

Voice input requires:
- HTTPS connection (automatic on Vercel)
- Microphone permissions
- Chrome/Edge browser recommended

## Security Checklist

For production use:

- [ ] Replace hardcoded password with real auth
- [ ] Add backend API for patient data
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Enable CORS properly
- [ ] Add input validation
- [ ] Implement HIPAA compliance
- [ ] Add audit logging

## Monitoring

Monitor your app:
- **Vercel Dashboard**: Real-time logs and analytics
- **Error Tracking**: Set up Sentry (optional)
- **Uptime Monitoring**: Set up external service

## Scaling

Vercel automatically scales your app:
- Global CDN
- Edge caching
- Serverless functions
- Automatic SSL

## Cost

- **Free Tier**: 100 GB bandwidth/month
- **Pro**: $20/month for higher limits
- **Enterprise**: Custom pricing

This project fits comfortably in free tier for demos/hackathons.

## Update Deployment

To update your deployed app:

**Via Vercel CLI**:
```bash
git add .
git commit -m "Update: description"
vercel --prod
```

**Via GitHub** (if connected):
```bash
git add .
git commit -m "Update: description"
git push
```
Vercel auto-deploys on push!

## Rollback

If something breaks:
```bash
vercel rollback
```

Or use Vercel dashboard → Deployments → Select previous → Promote to Production

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Support](https://vercel.com/support)

## Demo Credentials

For testing:
- **Patient IDs**: PT2026000000 through PT2026015011 (15,012 patients)
- **Password**: abcd (all patients)

## Features Showcase

When demoing to judges/users:

1. **Show splash screen** with language selection
2. **Login** with any patient ID
3. **Demo mode** for live data simulation
4. **Voice input** in symptoms (must allow mic)
5. **Document upload** with AI analysis
6. **Risk prediction** with speedometer
7. **SOS feature** for high-risk patients

## Troubleshooting Checklist

- [ ] All dependencies installed
- [ ] Build completes without errors
- [ ] All imports are correct
- [ ] CSV file is in public/data/
- [ ] No hardcoded localhost URLs
- [ ] All icons properly imported
- [ ] TypeScript errors resolved

## Success!

Your app is now live! 🎉

Share your deployment URL:
`https://your-project-name.vercel.app`

---

Need help? Check:
- README.md for usage instructions
- Vercel dashboard for logs
- Browser console for errors
