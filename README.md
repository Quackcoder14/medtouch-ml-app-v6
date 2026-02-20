# MedTouch.ai - AI Medical Triage System

A comprehensive medical triage application built with Next.js, featuring AI-powered risk assessment, multilingual support, and real-time vital monitoring.

## Features

- 🌍 **Multilingual Support**: English, Spanish, French, Hindi, Tamil, Arabic
- 🩺 **Smart Triage**: AI-powered risk assessment using patient vitals and symptoms
- ⌚ **Wearable Integration**: Connect to smartwatches for live data
- 🎤 **Voice Input**: Speak symptoms in any supported language
- 📄 **Document Analysis**: AI-powered medical document extraction
- 📊 **Risk Visualization**: Speedometer gauges and contribution factors
- 🏥 **Hospital Recommendations**: Nearby hospital suggestions
- 🚑 **Emergency SOS**: One-click ambulance calling for high-risk patients

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts, React Gauge Chart
- **File Upload**: React Dropzone

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to complete deployment

### Option 2: Deploy via Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Go to [vercel.com](https://vercel.com) and sign in

3. Click "New Project"

4. Import your repository

5. Vercel will auto-detect Next.js and configure settings

6. Click "Deploy"

### Environment Variables (if needed)

No environment variables are required for basic functionality.

## Usage

### Login Credentials

- **Patient ID**: Any ID from the CSV (e.g., PT2026000000)
- **Password**: `abcd` (default for all patients)

### User Flow

1. **Splash Screen**: Select language preference
2. **Login**: Enter patient ID and password
3. **Welcome**: View past data, connect wearable or demo mode
4. **Vitals**: Input or auto-fill vital signs
5. **Symptoms**: Select or voice-input symptoms
6. **Medical History**: Upload documents or select conditions
7. **Review**: Confirm all information
8. **Risk Prediction**: View AI analysis and recommendations

### Demo Mode

Click "Demo Mode" to simulate live data updates without a physical wearable device.

### Voice Input

1. Click "Click to Speak" in the symptoms screen
2. Allow microphone access when prompted
3. Speak your symptoms clearly
4. The app will automatically map to available symptoms
5. Click "Click to Stop" when finished

## Project Structure

```
medtouch-app/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main app component
├── components/
│   ├── SplashScreen.tsx      # Language selection
│   ├── LoginScreen.tsx       # Authentication
│   ├── WelcomeScreen.tsx     # Patient dashboard
│   ├── VitalsScreen.tsx      # Vitals input
│   ├── SymptomsScreen.tsx    # Symptom selection
│   ├── MedicalHistoryScreen.tsx  # Medical history
│   ├── ReviewScreen.tsx      # Review information
│   └── RiskPredictionScreen.tsx  # AI results
├── utils/
│   └── translations.ts       # Language translations
├── public/
│   └── data/
│       └── patients.csv      # Patient database
└── package.json
```

## Browser Compatibility

- Chrome 90+ (recommended for voice input)
- Firefox 88+
- Safari 14+
- Edge 90+

**Note**: Voice input requires HTTPS in production or localhost for development.

## Troubleshooting

### Voice Input Not Working

- Ensure you're using HTTPS or localhost
- Grant microphone permissions in browser
- Use Chrome or Edge for best compatibility

### Wearable Connection

- This is a demo feature and simulates device connection
- In production, integrate with actual wearable APIs

### Build Errors

If you encounter build errors:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run build
```

## Performance Optimization

The app is optimized for production with:
- Server-side rendering (SSR)
- Code splitting
- Image optimization
- Lazy loading
- Efficient animations

## Security Notes

- Patient data is loaded from CSV for demo purposes
- In production, implement proper authentication
- Use secure backend APIs for patient data
- Implement HIPAA compliance measures
- Add rate limiting and input validation

## Future Enhancements

- Real wearable device integration (Apple Health, Google Fit)
- Backend API integration
- Real-time doctor consultation
- Prescription management
- Appointment scheduling
- Medical imaging analysis

## License

This project is for demonstration purposes. Consult legal requirements for medical software in your jurisdiction.

## Support

For issues or questions, please open an issue in the repository.

---

**Medical Disclaimer**: This is a demonstration application and should not be used for actual medical diagnosis or treatment. Always consult healthcare professionals for medical advice.
