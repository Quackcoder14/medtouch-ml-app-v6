# MedTouch.ai Architecture Diagrams (Mermaid)

## 1. System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[Next.js 14 Web App]
        Splash[SplashScreen]
        Login[LoginScreen]
        Welcome[WelcomeScreen]
        Vitals[VitalsScreen]
        Symptoms[SymptomsScreen]
        History[MedicalHistoryScreen]
        Review[ReviewScreen]
        Risk[RiskPredictionScreen]
    end
    
    subgraph "API Gateway"
        Gateway[API Gateway]
        WS[WebSocket Server]
        Auth[Auth Middleware]
    end
    
    subgraph "Microservices"
        AuthSvc[Authentication Service]
        TriageSvc[Triage Service]
        MLSvc[AI/ML Service]
        WearSvc[Wearable Integration]
        DocSvc[Document Processing]
    end
    
    subgraph "AI/ML Models"
        GBDT[Gradient Boosting]
        RF[Random Forest]
        DNN[Deep Neural Network]
        NLP[NLP Engine]
        OCR[OCR Engine]
    end
    
    subgraph "Data Layer"
        DB[(PostgreSQL)]
        Cache[(Redis Cache)]
        Storage[(File Storage)]
    end
    
    subgraph "External Services"
        Speech[Speech Recognition APIs]
        EMR[Hospital EMR Systems]
        Emergency[Emergency Services]
        Maps[Mapping Services]
    end
    
    UI --> Gateway
    UI --> WS
    Gateway --> Auth
    Auth --> AuthSvc
    Auth --> TriageSvc
    Auth --> MLSvc
    Auth --> WearSvc
    Auth --> DocSvc
    
    TriageSvc --> DB
    AuthSvc --> DB
    WearSvc --> Cache
    
    MLSvc --> GBDT
    MLSvc --> RF
    MLSvc --> DNN
    MLSvc --> NLP
    
    DocSvc --> OCR
    DocSvc --> Storage
    
    MLSvc --> Speech
    TriageSvc --> EMR
    Risk --> Emergency
    Risk --> Maps
    
    style UI fill:#4A90E2
    style MLSvc fill:#9B59B6
    style DB fill:#E67E22
    style AuthSvc fill:#27AE60
```

## 2. User Flow Diagram

```mermaid
stateDiagram-v2
    [*] --> Splash: App Load
    Splash --> Login: Select Language (3s)
    
    Login --> Welcome: Authentication Success
    Login --> Login: Invalid Credentials
    
    Welcome --> Vitals: Check Health
    Welcome --> WearableModal: Connect Wearable
    WearableModal --> Welcome: Connected
    
    Vitals --> Symptoms: Continue
    Symptoms --> Vitals: Back
    
    Symptoms --> History: Continue
    History --> Symptoms: Back
    
    History --> Review: Continue
    Review --> History: Back
    
    Review --> Prediction: Submit
    Prediction --> Login: New Patient
    
    Prediction --> SOSModal: High Risk + SOS Button
    SOSModal --> Prediction: Close
```

## 3. Component Hierarchy

```mermaid
graph TD
    App[App - Main State Container]
    App --> Splash[SplashScreen]
    App --> Login[LoginScreen]
    App --> Welcome[WelcomeScreen]
    App --> Vitals[VitalsScreen]
    App --> Symptoms[SymptomsScreen]
    App --> History[MedicalHistoryScreen]
    App --> Review[ReviewScreen]
    App --> Prediction[RiskPredictionScreen]
    
    Splash --> LangSelector[Language Selector]
    Splash --> AnimatedLogo[Animated Logo]
    
    Login --> PatientInput[Patient ID Input]
    Login --> PasswordInput[Password Input]
    Login --> CSVLoader[CSV Data Loader]
    
    Welcome --> PastCharts[Past Data Charts]
    Welcome --> WearableBtn[Wearable Button]
    Welcome --> DemoBtn[Demo Mode Button]
    Welcome --> LiveUpdates[Live Data Updates]
    
    PastCharts --> HRChart[Heart Rate Chart]
    PastCharts --> BPChart[BP Chart]
    PastCharts --> TempDisplay[Temperature]
    
    Vitals --> AgeSlider[Age Slider]
    Vitals --> GenderSelect[Gender Selector]
    Vitals --> HRSlider[Heart Rate Slider]
    Vitals --> TempSlider[Temperature Slider]
    Vitals --> BPSliders[BP Sliders]
    
    Symptoms --> VoiceInput[Voice Input Component]
    Symptoms --> SymptomGrid[Symptom Grid - 60+]
    
    VoiceInput --> SpeechRecognition[Web Speech API]
    VoiceInput --> SymptomMapper[Symptom Mapping]
    
    History --> DocUpload[Document Upload Dropzone]
    History --> DocSummary[Document Summary]
    History --> ConditionSelect[Condition Selector]
    
    Prediction --> RiskGauge[Risk Gauge Component]
    Prediction --> ConfMetrics[Confidence Metrics]
    Prediction --> Factors[Contributing Factors]
    Prediction --> DeptCard[Department Card]
    Prediction --> HospitalList[Hospital List]
    Prediction --> SOSButton[SOS Button]
    
    RiskGauge --> SVGGauge[SVG Speedometer]
    RiskGauge --> AnimatedNeedle[Animated Needle]
    
    style App fill:#4A90E2
    style Prediction fill:#9B59B6
    style RiskGauge fill:#E67E22
```

## 4. ML Pipeline Flow

```mermaid
flowchart LR
    subgraph Input
        Demographics[Patient Demographics]
        Vitals[Vital Signs - 7 params]
        Symptoms[Symptoms Array]
        History[Medical History]
    end
    
    subgraph FeatureEngineering[Feature Engineering]
        Normalize[Normalization]
        Encode[Encoding]
        Derive[Derived Features]
    end
    
    subgraph Models[Ensemble Models]
        GBDT[GBDT - 40%]
        RF[Random Forest - 35%]
        DNN[Neural Network - 25%]
    end
    
    subgraph MetaModel[Meta Model]
        Voting[Weighted Voting]
        Confidence[Confidence Calc]
    end
    
    subgraph Explainability
        SHAP[SHAP Values]
        Factors[Factor Analysis]
    end
    
    subgraph Output
        RiskScore[Risk Score 0-100]
        RiskLevel[High/Medium/Low]
        Department[Department Recommendation]
        Visual[Visual Output]
    end
    
    Demographics --> Normalize
    Vitals --> Normalize
    Symptoms --> Encode
    History --> Encode
    
    Normalize --> Derive
    Encode --> Derive
    
    Derive --> GBDT
    Derive --> RF
    Derive --> DNN
    
    GBDT --> Voting
    RF --> Voting
    DNN --> Voting
    
    Voting --> Confidence
    Confidence --> SHAP
    SHAP --> Factors
    
    Confidence --> RiskScore
    RiskScore --> RiskLevel
    Factors --> Visual
    RiskLevel --> Department
    
    style Models fill:#9B59B6
    style Output fill:#27AE60
```

## 5. Real-Time Data Flow

```mermaid
sequenceDiagram
    participant Device as Wearable Device
    participant BLE as Bluetooth
    participant API as Health API
    participant WS as WebSocket
    participant State as React State
    participant UI as UI Component
    
    Device->>BLE: Send vital data (every 2s)
    BLE->>API: Forward to Health API
    API->>WS: Stream via WebSocket
    WS->>State: Update state (useEffect)
    State->>State: Calculate realistic variation
    State->>UI: Trigger re-render
    UI->>UI: Animate with Framer Motion
    
    Note over Device,UI: Continuous loop every 2 seconds
    
    alt Demo Mode
        State->>State: Generate simulated data
        State->>UI: Update display
    end
    
    alt Anomaly Detected
        State->>State: Check threshold
        State->>UI: Show alert
    end
```

## 6. Deployment Architecture

```mermaid
graph TB
    subgraph Internet
        Users[Users - Global]
    end
    
    subgraph "Edge Network - Cloudflare"
        CDN[Global CDN]
        DDoS[DDoS Protection]
        SSL[SSL/TLS]
    end
    
    subgraph "Vercel Platform"
        EdgeFn[Edge Functions]
        SSR[Server-Side Rendering]
        API[API Routes - Serverless]
    end
    
    subgraph "Application Layer"
        NextApp[Next.js App]
        StaticPages[Static Pages]
        DynamicPages[Dynamic Pages]
    end
    
    subgraph "Data Services"
        Postgres[(PostgreSQL)]
        Redis[(Redis Cache)]
        S3[(S3 Storage)]
    end
    
    subgraph "External APIs"
        Speech[Speech APIs]
        ML[ML Models]
        EMR[EMR Systems]
    end
    
    Users --> CDN
    CDN --> DDoS
    DDoS --> SSL
    SSL --> EdgeFn
    EdgeFn --> SSR
    SSR --> API
    API --> NextApp
    
    NextApp --> StaticPages
    NextApp --> DynamicPages
    
    API --> Postgres
    API --> Redis
    API --> S3
    
    API --> Speech
    API --> ML
    API --> EMR
    
    style EdgeFn fill:#4A90E2
    style API fill:#27AE60
    style Postgres fill:#E67E22
```

## 7. Security Architecture

```mermaid
graph TD
    subgraph "Network Security Layer"
        WAF[Web Application Firewall]
        DDoS[DDoS Protection]
        RateLimit[Rate Limiting]
    end
    
    subgraph "Application Security"
        CSP[Content Security Policy]
        XSS[XSS Prevention]
        CSRF[CSRF Protection]
        JWT[JWT Authentication]
    end
    
    subgraph "Data Security"
        EncryptTransit[TLS 1.3 Encryption]
        EncryptRest[AES-256 at Rest]
        KeyMgmt[Key Management]
    end
    
    subgraph "Access Control"
        RBAC[Role-Based Access]
        MFA[Multi-Factor Auth]
        Audit[Audit Logging]
    end
    
    subgraph "Compliance"
        HIPAA[HIPAA Compliance]
        Privacy[Privacy Controls]
        Retention[Data Retention]
    end
    
    Internet[Public Internet] --> WAF
    WAF --> DDoS
    DDoS --> RateLimit
    RateLimit --> CSP
    
    CSP --> XSS
    XSS --> CSRF
    CSRF --> JWT
    
    JWT --> EncryptTransit
    EncryptTransit --> EncryptRest
    EncryptRest --> KeyMgmt
    
    KeyMgmt --> RBAC
    RBAC --> MFA
    MFA --> Audit
    
    Audit --> HIPAA
    HIPAA --> Privacy
    Privacy --> Retention
    
    style WAF fill:#E74C3C
    style JWT fill:#27AE60
    style HIPAA fill:#3498DB
```

## Usage

Copy any of these Mermaid diagrams and paste them into:
- GitHub README.md
- Mermaid Live Editor (mermaid.live)
- VS Code with Mermaid extension
- Notion (supports Mermaid)
- GitLab
- Confluence

Or export as:
- PNG image
- SVG vector
- PDF document
