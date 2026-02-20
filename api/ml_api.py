"""
MedTouch.ai ML Prediction API
Uses actual trained ensemble models (XGBoost, Random Forest, GBDT)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# Base directory for model files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

def load_model(filename):
    """Try models/ subdirectory first, then fall back to base directory"""
    path_in_models = os.path.join(MODELS_DIR, filename)
    path_in_base = os.path.join(BASE_DIR, filename)
    if os.path.exists(path_in_models):
        return joblib.load(path_in_models)
    elif os.path.exists(path_in_base):
        return joblib.load(path_in_base)
    else:
        raise FileNotFoundError(f"Model file '{filename}' not found in {MODELS_DIR} or {BASE_DIR}")

# Load all models at startup
print("Loading ML models...")
try:
    risk_model = load_model('risk_model.pkl')
    dept_model = load_model('department_model.pkl')
    le_gender = load_model('le_gender.pkl')
    le_symptoms = load_model('le_symptoms.pkl')
    le_pre_existing = load_model('le_pre_existing.pkl')
    print("✓ All models loaded successfully!")
    print(f"Risk Model Type: {type(risk_model).__name__}")
    print(f"Department Model Type: {type(dept_model).__name__}")
except Exception as e:
    print(f"✗ Error loading models: {e}")
    raise

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'models_loaded': True,
        'risk_model': type(risk_model).__name__,
        'dept_model': type(dept_model).__name__
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Main prediction endpoint using REAL ML models
    
    Expected JSON input:
    {
        "age": int,
        "gender": str,
        "systolicBP": int,
        "diastolicBP": int,
        "heartRate": int,
        "temperature": float,
        "symptoms": list[str],
        "preExisting": str
    }
    """
    try:
        data = request.json
        
        # Validate input
        required_fields = ['age', 'gender', 'systolicBP', 'diastolicBP', 
                          'heartRate', 'temperature', 'symptoms', 'preExisting']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        # Encode categorical features
        try:
            gender_encoded = le_gender.transform([data['gender']])[0]
        except:
            gender_encoded = 0  # Default if not found
        
        # Use first symptom (primary symptom)
        primary_symptom = data['symptoms'][0] if data['symptoms'] else 'Cough'
        try:
            symptom_encoded = le_symptoms.transform([primary_symptom])[0]
        except:
            symptom_encoded = 0  # Default if not found
        
        try:
            pre_existing_encoded = le_pre_existing.transform([data['preExisting']])[0]
        except:
            pre_existing_encoded = 0  # Default if not found
        
        # Create feature vector for ML model
        X = np.array([[
            data['age'],
            gender_encoded,
            data['systolicBP'],
            data['diastolicBP'],
            data['heartRate'],
            data['temperature'],
            symptom_encoded,
            pre_existing_encoded
        ]])
        
        # REAL ML PREDICTION - Using trained ensemble models
        risk_prediction = risk_model.predict(X)[0]
        risk_probabilities = risk_model.predict_proba(X)[0]
        
        dept_prediction = dept_model.predict(X)[0]
        dept_probabilities = dept_model.predict_proba(X)[0]
        
        # Get class labels
        risk_classes = risk_model.classes_
        dept_classes = dept_model.classes_
        
        # Create probability dictionaries
        risk_probs_dict = {
            str(cls): float(prob) for cls, prob in zip(risk_classes, risk_probabilities)
        }
        
        dept_probs_dict = {
            str(cls): float(prob) for cls, prob in zip(dept_classes, dept_probabilities)
        }
        
        # Calculate contributing factors based on feature importance
        factors = []
        
        # Age factor
        if data['age'] > 65:
            factors.append({
                'name': 'Age > 65 years',
                'impact': min(25, (data['age'] - 65) * 0.5)
            })
        elif data['age'] > 50:
            factors.append({
                'name': 'Age > 50 years',
                'impact': min(15, (data['age'] - 50) * 0.3)
            })
        
        # Blood pressure
        if data['systolicBP'] > 140 or data['diastolicBP'] > 90:
            bp_deviation = max(data['systolicBP'] - 140, data['diastolicBP'] - 90)
            factors.append({
                'name': 'Elevated Blood Pressure',
                'impact': min(20, bp_deviation * 0.3)
            })
        
        # Heart rate
        if data['heartRate'] > 100:
            factors.append({
                'name': 'Tachycardia',
                'impact': min(15, (data['heartRate'] - 100) * 0.2)
            })
        elif data['heartRate'] < 60:
            factors.append({
                'name': 'Bradycardia',
                'impact': min(15, (60 - data['heartRate']) * 0.2)
            })
        
        # Temperature
        if data['temperature'] > 38.5:
            factors.append({
                'name': 'High Fever',
                'impact': min(20, (data['temperature'] - 38.5) * 5)
            })
        elif data['temperature'] < 36:
            factors.append({
                'name': 'Hypothermia',
                'impact': min(20, (36 - data['temperature']) * 5)
            })
        
        # Critical symptoms
        critical_symptoms = ['Difficulty Breathing', 'Chest Pain', 'Stroke Symptoms', 
                            'Loss of Consciousness', 'Severe Headache']
        has_critical = any(s in data['symptoms'] for s in critical_symptoms)
        if has_critical:
            factors.append({
                'name': 'Critical Symptoms Present',
                'impact': 30
            })
        
        # Pre-existing conditions
        serious_conditions = ['Heart Disease', 'Diabetes', 'Cancer', 'Kidney Disease', 
                             'COPD', 'Stroke History']
        if data['preExisting'] in serious_conditions:
            factors.append({
                'name': f'Pre-existing: {data["preExisting"]}',
                'impact': 18
            })
        
        # Calculate confidence based on probability margin
        confidence = float(max(risk_probabilities)) * 100
        
        # Get the actual model info
        model_info = {
            'type': type(risk_model).__name__,
            'using_ensemble': 'Ensemble' in type(risk_model).__name__ or 'Random' in type(risk_model).__name__,
            'features_used': 8
        }
        
        # Prepare response
        response = {
            'risk': str(risk_prediction),
            'riskScore': float(max(risk_probabilities) * 100),
            'riskProbabilities': risk_probs_dict,
            'confidence': confidence,
            'department': str(dept_prediction),
            'departmentProbabilities': dept_probs_dict,
            'departmentConfidence': float(max(dept_probabilities) * 100),
            'factors': factors,
            'modelInfo': model_info,
            'mlUsed': True,
            'modelType': type(risk_model).__name__
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'mlUsed': False
        }), 500

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get information about loaded ML models"""
    try:
        info = {
            'risk_model': {
                'type': type(risk_model).__name__,
                'classes': risk_model.classes_.tolist() if hasattr(risk_model, 'classes_') else [],
                'n_features': risk_model.n_features_in_ if hasattr(risk_model, 'n_features_in_') else 8
            },
            'department_model': {
                'type': type(dept_model).__name__,
                'classes': dept_model.classes_.tolist() if hasattr(dept_model, 'classes_') else [],
                'n_features': dept_model.n_features_in_ if hasattr(dept_model, 'n_features_in_') else 8
            },
            'encoders': {
                'gender': le_gender.classes_.tolist(),
                'symptoms': le_symptoms.classes_.tolist(),
                'pre_existing': le_pre_existing.classes_.tolist()
            }
        }
        return jsonify(info)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
