# Architecture Diagram Generation Prompts for MedTouch.ai

## For AI Diagram Tools (Mermaid, PlantUML, Draw.io AI, etc.)

---

## Prompt 1: System Architecture Diagram

```
Create a comprehensive system architecture diagram for MedTouch.ai, a medical triage application with the following components:

**Frontend Layer:**
- Next.js 14 Web Application (TypeScript, React)
- Mobile-responsive interface
- Components: SplashScreen, LoginScreen, WelcomeScreen, VitalsScreen, SymptomsScreen, MedicalHistoryScreen, ReviewScreen, RiskPredictionScreen

**API Gateway:**
- RESTful API endpoints
- WebSocket server for real-time data
- Authentication middleware
- Rate limiting

**Microservices:**
1. Authentication Service
   - JWT token management
   - Patient ID verification
   - Session management

2. Triage Service
   - Patient data management
   - Vital signs processing
   - Symptom collection

3. AI/ML Service
   - Risk assessment engine (Ensemble model: GBDT + Random Forest + DNN)
   - NLP processing (multilingual speech recognition)
   - Document analysis (OCR + NER)
   - Explainable AI (SHAP values)

4. Wearable Integration Service
   - Apple Health connector
   - Google Fit connector
   - Fitbit API
   - Garmin Connect
   - Real-time vital streaming

5. Document Processing Service
   - OCR engine
   - Medical entity extraction
   - Structured data extraction

**Data Layer:**
- PostgreSQL (Patient records, encrypted)
- Redis (Session cache, real-time data)
- S3/Blob Storage (Medical documents)

**External Integrations:**
- Speech Recognition APIs (6 languages)
- Hospital EMR systems (HL7 FHIR)
- Emergency services API
- Mapping services (nearby hospitals)

**Security:**
- HTTPS/TLS encryption
- HIPAA-compliant infrastructure
- Role-based access control
- Audit logging

Show data flow from patient input through AI processing to risk assessment output.
Use different colors for frontend (blue), backend services (green), AI/ML (purple), and data stores (orange).
Include arrows showing synchronous API calls (solid lines) and asynchronous events (dashed lines).
```

---

## Prompt 2: Data Flow Diagram

```
Generate a detailed data flow diagram for the MedTouch.ai medical triage system showing:

**User Journey Flow:**

1. **Login Flow:**
   Patient ID input → Authentication Service → CSV Database lookup → JWT token generation → Welcome Screen

2. **Vital Signs Collection Flow:**
   Manual input OR Wearable device → Bluetooth connection → Real-time streaming → WebSocket → VitalsScreen → Local state update every 2 seconds

3. **Symptoms Collection Flow:**
   Voice input (6 languages) → Speech-to-Text API → Medical NLP Service → Entity extraction → Symptom mapping → Normalized symptoms list
   OR
   Manual selection → Multi-select UI → Symptoms array

4. **Medical History Flow:**
   Document upload (PDF/Image/DOCX) → OCR Service → Text extraction → Medical NER → Structured data extraction → Display summary
   OR
   Manual condition selection → Pre-existing condition string

5. **Risk Assessment Flow:**
   All collected data → Feature engineering → Ensemble ML Model (3 models) → Risk score calculation → SHAP explainability analysis → Contribution factors → Department recommendation → Display results

6. **Emergency Response Flow:**
   High risk detected → SOS button → Emergency API call → Ambulance dispatch → Confirmation animation

**Data Transformations:**
- Speech audio → Text transcript → Medical entities → Standard symptom codes
- Raw vitals → Normalized values → Trend analysis → Anomaly detection
- Scanned document → Text blocks → Medical concepts → Structured fields
- Patient features → ML model input → Risk probabilities → Final classification

Use swim lanes for different services and show data transformation at each step.
Color code by data type: vitals (red), symptoms (yellow), history (blue), risk score (green).
```

---

## Prompt 3: Component Architecture Diagram

```
Create a detailed component architecture diagram for the MedTouch.ai Next.js application:

**App Structure:**
```
app/
├── page.tsx (Main App - State Manager)
├── layout.tsx (Root Layout)
└── globals.css (Global Styles)
```

**Components Hierarchy:**
```
App (Main State Container)
├── State Management:
│   ├── screen: 'splash' | 'login' | 'welcome' | 'vitals' | 'symptoms' | 'history' | 'review' | 'prediction'
│   ├── language: Language (en, es, fr, hi, ta, ar)
│   ├── patientData: PatientData
│   ├── formData: FormData
│   ├── wearableConnected: boolean
│   └── demoMode: boolean
│
├── SplashScreen
│   ├── Language selector (6 options)
│   ├── Animated logo (Heart + Activity icons)
│   └── Loading animation
│
├── LoginScreen
│   ├── Patient ID input field
│   ├── Password input field
│   ├── CSV data loader (useEffect)
│   ├── Authentication logic
│   └── Error handling
│
├── WelcomeScreen
│   ├── Past data visualizations (Recharts)
│   │   ├── Heart rate chart (AreaChart)
│   │   ├── Blood pressure chart (LineChart)
│   │   └── Temperature display
│   ├── Wearable connection modal
│   │   ├── Device list (4 devices)
│   │   └── Connection animation
│   ├── Demo mode toggle
│   └── Live data updates (useEffect + setInterval)
│
├── VitalsScreen
│   ├── Age slider (1-120)
│   ├── Gender selector (Male/Female)
│   ├── Heart rate slider (40-200 BPM)
│   ├── Temperature slider (35-42°C)
│   ├── Systolic BP slider (70-200 mmHg)
│   ├── Diastolic BP slider (40-130 mmHg)
│   ├── Respiratory rate slider (8-30/min)
│   ├── Oxygen saturation slider (80-100%)
│   ├── Demo mode button
│   └── Real-time updates (if wearable/demo active)
│
├── SymptomsScreen
│   ├── Voice input component
│   │   ├── Speech recognition (Web Speech API)
│   │   ├── Real-time transcription
│   │   └── Symptom mapping logic
│   ├── Symptom grid (60+ symptoms)
│   │   ├── Multi-select checkboxes
│   │   └── Selected count display
│   └── Navigation buttons
│
├── MedicalHistoryScreen
│   ├── Document upload (React Dropzone)
│   │   ├── Drag & drop zone
│   │   ├── File type validation
│   │   ├── Upload progress
│   │   └── Analysis simulation
│   ├── Document summary display
│   │   ├── Detected conditions
│   │   ├── Extracted vitals
│   │   ├── Medications list
│   │   └── Key findings
│   ├── Pre-existing conditions selector
│   │   └── 15 condition options
│   └── Navigation buttons
│
├── ReviewScreen
│   ├── Patient info card
│   ├── Vital signs summary
│   ├── Symptoms list
│   ├── Medical history display
│   └── Submit button
│
├── RiskPredictionScreen
│   ├── Risk calculation logic (useEffect)
│   ├── RiskGauge component (Custom SVG)
│   │   ├── Animated speedometer
│   │   ├── Needle rotation
│   │   └── Score display
│   ├── Risk level badge (High/Medium/Low)
│   ├── AI confidence metrics
│   │   ├── Accuracy: 89.5%
│   │   ├── Precision: 87.2%
│   │   ├── Recall: 91.3%
│   │   └── F1 Score: 89.2%
│   ├── Contributing factors display
│   │   ├── Circular progress indicators
│   │   ├── Percentage calculations
│   │   └── Visual breakdown
│   ├── Department recommendation
│   ├── Nearby hospitals list (3 hospitals)
│   ├── SOS button (if high risk)
│   │   └── Ambulance animation modal
│   └── New patient button
│
└── RiskGauge (Reusable Component)
    ├── SVG speedometer
    ├── Animated needle (Framer Motion)
    ├── Color-coded segments (green/yellow/red)
    └── Score display
```

**Utility Modules:**
```
utils/
└── translations.ts
    ├── Translation dictionary (6 languages)
    ├── getTranslation function
    └── 100+ translated keys
```

**Data Models:**
```
Types:
├── Language: 'en' | 'es' | 'fr' | 'hi' | 'ta' | 'ar'
├── PatientData: { patientId, age, gender, vitals, symptoms, history, risk, department }
├── VitalsData: { age, gender, BP, HR, temp, RR, SpO2 }
├── FormData: { vitals, symptoms, preExisting, medicalDocument }
└── RiskData: { riskLevel, riskScore, department, confidence, factors, metrics }
```

Use UML-style component diagrams with clear parent-child relationships.
Show props flow with arrows and state management with different colors.
Indicate which components have local state vs receive props.
```

---

## Prompt 4: AI/ML Pipeline Diagram

```
Generate a detailed machine learning pipeline diagram for MedTouch.ai's risk assessment system:

**Input Layer:**
- Patient Demographics (age, gender)
- Vital Signs (7 parameters: BP systolic/diastolic, HR, temp, RR, SpO2)
- Symptoms (array of 60+ possible symptoms)
- Medical History (pre-existing conditions)
- Document Data (if available)

**Feature Engineering Layer:**
1. Numerical Features:
   - Age normalization (0-1 scale)
   - BP deviation score (distance from normal)
   - Heart rate zone classification
   - Temperature anomaly detection
   - SpO2 risk score

2. Categorical Encoding:
   - Gender (one-hot encoding)
   - Symptoms (multi-hot encoding, 60-dimensional vector)
   - Pre-existing conditions (ordinal encoding by severity)

3. Derived Features:
   - Symptom severity index (weighted sum)
   - Comorbidity risk score
   - Vital instability metric (variance across vitals)
   - Age-symptom interaction features
   - Vital-symptom correlation features

**Model Ensemble Layer:**

Branch 1: Gradient Boosting Decision Trees (Weight: 0.40)
- Input: All 15+ features
- Architecture: 100 trees, max depth 6
- Output: Risk probability [0-1]

Branch 2: Random Forest (Weight: 0.35)
- Input: All 15+ features
- Architecture: 200 trees, bootstrap sampling
- Output: Risk probability [0-1]

Branch 3: Deep Neural Network (Weight: 0.25)
- Input: All 15+ features
- Architecture: 
  - Input Layer (15 nodes)
  - Hidden Layer 1 (64 nodes, ReLU)
  - Dropout (0.3)
  - Hidden Layer 2 (32 nodes, ReLU)
  - Dropout (0.3)
  - Output Layer (3 nodes, Softmax)
- Output: Risk probabilities [Low, Medium, High]

**Meta-Model Layer:**
- Weighted voting (0.40 × GBDT + 0.35 × RF + 0.25 × DNN)
- Confidence calculation
- Final risk classification: Low (<30), Medium (30-60), High (>60)

**Explainability Layer:**
1. SHAP Value Calculation
   - Per-feature importance
   - Direction of influence
   
2. Contribution Factor Analysis
   - Age factor (%)
   - BP factor (%)
   - Symptom severity (%)
   - Comorbidity risk (%)
   - Vital instability (%)

3. Visual Output Generation
   - Speedometer gauge (0-100 scale)
   - Circular progress indicators per factor
   - Confidence metrics display

**Output Layer:**
- Risk Level: High/Medium/Low
- Risk Score: 0-100
- Confidence: 75-90%
- Contributing Factors: Array of {name, impact, percentage}
- Department Recommendation: String
- Clinical Recommendations: Text based on risk level

**Training Pipeline:**
- Dataset: 15,000+ patient records
- Validation: 5-fold cross-validation
- Metrics: Accuracy (89.5%), Precision (87.2%), Recall (91.3%), F1 (89.2%)
- Update Frequency: Monthly with new data

Show the flow from raw inputs through feature engineering, parallel model processing, ensemble aggregation, to final explainable output.
Use different shapes: rectangles for data, circles for transformations, diamonds for decision points, hexagons for models.
```

---

## Prompt 5: Deployment Architecture Diagram

```
Create a cloud deployment architecture diagram for MedTouch.ai on Vercel:

**Edge Network Layer:**
- Global CDN (Cloudflare)
- Edge caching for static assets
- DDoS protection
- SSL/TLS termination

**Vercel Platform:**
- Next.js Application (Serverless)
- Automatic deployments from Git
- Preview deployments for branches
- Edge functions (low latency)
- ISR (Incremental Static Regeneration)

**Frontend Deployment:**
- Static pages (SSG): Splash screen
- Server-side rendered (SSR): Login, Dashboard screens
- Client-side components: Interactive features
- Code splitting per route
- Lazy loading for large components

**API Routes (Serverless Functions):**
- /api/auth - Authentication endpoint
- /api/patients - Patient data retrieval
- /api/risk-assessment - ML prediction endpoint
- /api/document-upload - File processing
- /api/wearable-connect - Device integration

**Database Layer:**
- PostgreSQL (Supabase/Neon)
  - Patient records table
  - Encrypted sensitive data
  - Connection pooling
  
- Redis (Upstash)
  - Session cache
  - Real-time data buffer
  - Rate limiting

**External Services:**
- Speech Recognition APIs
  - Google Cloud Speech-to-Text
  - Language-specific models
  
- ML Model Hosting
  - Hugging Face Inference API
  - Custom model endpoints
  
- Storage (AWS S3 / Vercel Blob)
  - Medical documents
  - Patient images
  - Encrypted at rest

**Monitoring & Logging:**
- Vercel Analytics
- Error tracking (Sentry)
- Performance monitoring
- Audit logs (compliance)

**Security Layers:**
- WAF (Web Application Firewall)
- Rate limiting per IP
- JWT authentication
- CORS configuration
- HIPAA-compliant encryption

**CI/CD Pipeline:**
Git Push → GitHub → Vercel Build → Automated Tests → Preview Deployment → Merge to Main → Production Deployment

Show geographical distribution of edge nodes, data flow patterns, and security boundaries.
Use cloud architecture icons and show both synchronous (solid) and asynchronous (dashed) connections.
```

---

## Prompt 6: Real-Time Data Flow Diagram

```
Create a real-time data flow diagram showing how wearable device data flows through the MedTouch.ai system:

**Data Source:**
Apple Watch / Fitbit / Garmin
- Heart rate sensor (every 1-5 seconds)
- SpO2 sensor (every 10 seconds)
- Accelerometer (activity level)
- Temperature sensor (periodic)

**Device to App Connection:**
1. Bluetooth Low Energy (BLE) pairing
2. Device discovery and authentication
3. Characteristic subscription for continuous data

**Data Streaming Pipeline:**

Wearable Device 
  → Bluetooth 
  → Mobile OS Health API (Apple Health / Google Fit)
  → Web Bluetooth API / Native Bridge
  → WebSocket Connection
  → Frontend React State (useEffect hook)
  → Local State Update (every 2 seconds)
  → UI Re-render (Framer Motion animations)

**Parallel Processing:**

Real-time Stream → Anomaly Detection Engine
  ├→ Sudden spike detection (>15 BPM change)
  ├→ Trend analysis (sliding window 5 minutes)
  ├→ Correlation analysis (multi-vital)
  └→ Alert generation (if concerning patterns)

Real-time Stream → Historical Data Store
  ├→ Time-series database
  ├→ Data aggregation (per minute)
  └→ Chart data generation

Real-time Stream → Risk Re-calculation
  ├→ Feature update
  ├→ Model inference (if significant change)
  └→ UI update (if risk level changes)

**Data Flow Characteristics:**
- Frequency: 2-second updates
- Latency: <200ms end-to-end
- Data smoothing: Moving average (3-point)
- Quality filtering: Remove motion artifacts
- Battery optimization: Adaptive sampling rate

**State Management:**
```javascript
const [heartRate, setHeartRate] = useState(initial)
const [temperature, setTemperature] = useState(initial)
const [systolicBP, setSystolicBP] = useState(initial)

useEffect(() => {
  if (wearableConnected || demoMode) {
    const interval = setInterval(() => {
      // Realistic variation ±3 BPM
      setHeartRate(prev => 
        Math.max(60, Math.min(100, prev + (Math.random() - 0.5) * 3))
      )
    }, 2000)
    return () => clearInterval(interval)
  }
}, [wearableConnected, demoMode])
```

**Demo Mode Flow:**
- Simulated data generation
- Realistic physiological variations
- No actual device connection
- Same update frequency as real mode

Show bidirectional data flow, WebSocket protocol details, and state update cycles.
Use sequence diagram style with time on vertical axis.
```

---

## Prompt 7: Security Architecture Diagram

```
Generate a comprehensive security architecture diagram for MedTouch.ai showing all security layers:

**Network Security:**
- HTTPS/TLS 1.3 encryption
- Certificate pinning
- DDoS protection (Cloudflare)
- WAF (Web Application Firewall)
- Rate limiting (per IP, per endpoint)

**Application Security:**

Frontend:
- Content Security Policy (CSP)
- XSS prevention (React sanitization)
- CSRF tokens
- Input validation
- Secure session storage

API Gateway:
- JWT authentication
- Token expiration (15 min)
- Refresh token rotation
- Rate limiting (100 req/min)
- Request sanitization

Backend Services:
- Service-to-service authentication
- API key rotation
- Least privilege access
- Input validation
- SQL injection prevention

**Data Security:**

At Rest:
- AES-256 encryption
- Encrypted database columns (PHI)
- Encrypted file storage
- Key management (AWS KMS / Vault)

In Transit:
- TLS 1.3 for all connections
- Certificate validation
- Perfect forward secrecy
- End-to-end encryption for sensitive data

**Access Control:**

Authentication:
- Patient ID + Password
- JWT token-based sessions
- Multi-factor authentication (planned)
- Biometric authentication (mobile)

Authorization:
- Role-based access control (RBAC)
- Patient: own data only
- Nurse: triage data
- Doctor: full patient records
- Admin: system configuration

**Compliance Layers:**

HIPAA Compliance:
- Audit logging (all access)
- Data retention policies
- Breach notification system
- Business Associate Agreements
- Risk assessments

Privacy:
- Patient consent management
- Data minimization
- Right to deletion
- Data portability
- Privacy by design

**Monitoring & Incident Response:**

Detection:
- Intrusion detection system
- Anomaly detection
- Failed login monitoring
- Suspicious activity alerts

Logging:
- Access logs (who, what, when)
- API call logs
- Error logs
- Security event logs
- Audit trail (immutable)

Response:
- Automated incident response
- Alert escalation
- Forensic analysis tools
- Backup and recovery

**Security Boundaries:**
Show trust boundaries between:
- Public internet and edge network
- Edge network and application layer
- Application layer and data layer
- Service-to-service communication
- External API integrations

Use red for security threats, green for protections, yellow for monitoring.
Show encryption at each layer and authentication checkpoints.
```

---

## Usage Instructions

**For Different Tools:**

### Mermaid (Best for code-based diagrams):
Copy Prompt 1, 2, or 6 and add: "Generate this as Mermaid diagram syntax"

### PlantUML:
Copy any prompt and add: "Generate this as PlantUML code"

### Lucidchart AI / Draw.io:
Copy any prompt directly - these tools understand natural language

### Claude / ChatGPT:
Copy any prompt and add: "Generate ASCII art or Mermaid code for this architecture"

### Excalidraw:
Copy prompts 3, 4, or 5 and ask: "Describe this as a hand-drawn style diagram"

### Diagrams.net (Draw.io):
Use prompts as-is, the AI assistant will interpret and create

---

## Tips for Best Results

1. **Start with Prompt 1** for overall system architecture
2. **Use Prompt 3** for frontend component structure
3. **Use Prompt 4** for technical/ML audiences
4. **Use Prompt 5** for infrastructure/DevOps teams
5. **Combine multiple prompts** for comprehensive documentation

6. **Customize as needed:**
   - Remove sections not relevant to your presentation
   - Add specific tools you're using
   - Adjust complexity level for your audience
   - Focus on specific aspects (frontend, backend, AI)

7. **Output formats:**
   - PNG/SVG for presentations
   - PDF for documentation
   - Mermaid/PlantUML for version control
   - Interactive HTML for web docs

---

## Example Usage

```
Tool: ChatGPT with Mermaid
Input: "Use Prompt 1 and generate Mermaid diagram code"

Tool: Claude with ASCII
Input: "Use Prompt 3 and create an ASCII art component tree"

Tool: Lucidchart AI
Input: "Use Prompt 5 and create a deployment architecture diagram"

Tool: Excalidraw
Input: "Use Prompt 4 and create a hand-drawn ML pipeline diagram"
```

---

**These prompts will generate professional, comprehensive architecture diagrams for your MedTouch.ai hackathon presentation!**
