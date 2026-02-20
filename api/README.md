# MedTouch.ai ML API

Flask API that serves trained machine learning models for medical triage risk assessment.

## Models

This API loads and serves predictions from:
- **risk_model.pkl** - Ensemble/XGBoost model for risk classification (3.1 MB)
- **department_model.pkl** - Ensemble/XGBoost model for department routing (9.8 MB)
- **Label encoders** - For categorical feature encoding

## Endpoints

### GET /health
Health check and model status
```json
{
  "status": "healthy",
  "models_loaded": true,
  "risk_model_type": "RandomForestClassifier"
}
```

### POST /predict
Make risk prediction

**Request:**
```json
{
  "age": 65,
  "gender": "Male",
  "systolicBP": 150,
  "diastolicBP": 95,
  "heartRate": 95,
  "temperature": 38.5,
  "symptoms": ["Chest Pain", "Difficulty Breathing"],
  "preExisting": "Heart Disease"
}
```

**Response:**
```json
{
  "risk": "High",
  "riskConfidence": 92.5,
  "riskProbabilities": {
    "High": 92.5,
    "Medium": 5.2,
    "Low": 2.3
  },
  "department": "Emergency",
  "departmentConfidence": 95.8,
  "factors": [
    {"name": "Age > 65 years", "impact": 25},
    {"name": "Elevated Blood Pressure", "impact": 18},
    {"name": "Critical Symptoms: Chest Pain, Difficulty Breathing", "impact": 30}
  ],
  "modelType": {
    "risk": "RandomForestClassifier",
    "department": "RandomForestClassifier"
  },
  "mlMetrics": {
    "accuracy": 89.5,
    "precision": 87.2,
    "recall": 91.3,
    "f1Score": 89.2
  }
}
```

### GET /model-info
Get model information
```json
{
  "riskModel": {
    "type": "RandomForestClassifier",
    "classes": ["High", "Medium", "Low"],
    "nFeatures": 8
  },
  "departmentModel": {
    "type": "RandomForestClassifier",
    "classes": ["Emergency", "Cardiology", ...],
    "nFeatures": 8
  }
}
```

## Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run server
python app.py
```

Server starts on http://localhost:5000

## Deployment

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Railway
```bash
railway init
railway up
```

## Model Files

Ensure these files are in the `models/` directory:
- risk_model.pkl
- department_model.pkl
- le_gender.pkl
- le_symptoms.pkl
- le_pre_existing.pkl

Total size: ~13 MB

## Environment Variables

- `PORT` - Server port (default: 5000)
- `FLASK_ENV` - Environment (production/development)

## Requirements

- Python 3.8+
- Flask 3.0+
- scikit-learn 1.3+
- numpy 1.24+
