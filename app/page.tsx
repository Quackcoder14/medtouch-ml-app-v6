'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SplashScreen from '@/components/SplashScreen'
import LoginScreen from '@/components/LoginScreen'
import WelcomeScreen from '@/components/WelcomeScreen'
import VitalsScreen from '@/components/VitalsScreen'
import SymptomsScreen from '@/components/SymptomsScreen'
import MedicalHistoryScreen from '@/components/MedicalHistoryScreen'
import ReviewScreen from '@/components/ReviewScreen'
import RiskPredictionScreen from '@/components/RiskPredictionScreen'

export type Language = 'en' | 'es' | 'fr' | 'hi' | 'ta' | 'ar'

export interface PatientData {
  patientId: string
  age: number
  gender: string
  systolicBP: number
  diastolicBP: number
  heartRate: number
  temperature: number
  symptoms: string[]
  preExisting: string
  riskLevel: string
  department: string
}

export interface VitalsData {
  age: number
  gender: string
  systolicBP: number
  diastolicBP: number
  heartRate: number
  temperature: number
  respiratoryRate: number
  oxygenSaturation: number
}

export interface FormData {
  vitals: VitalsData
  symptoms: string[]
  preExisting: string
  medicalDocument: {
    name: string
    content: string
    extractedData: any
  } | null
}

export default function Home() {
  const [screen, setScreen] = useState<'splash' | 'login' | 'welcome' | 'vitals' | 'symptoms' | 'history' | 'review' | 'prediction'>('splash')
  const [language, setLanguage] = useState<Language>('en')
  const [patientData, setPatientData] = useState<PatientData | null>(null)
  const [formData, setFormData] = useState<FormData>({
    vitals: {
      age: 30,
      gender: 'Male',
      systolicBP: 120,
      diastolicBP: 80,
      heartRate: 72,
      temperature: 37.0,
      respiratoryRate: 16,
      oxygenSaturation: 98
    },
    symptoms: [],
    preExisting: 'No History',
    medicalDocument: null
  })
  const [wearableConnected, setWearableConnected] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setScreen('login')
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleLogin = (data: PatientData) => {
    setPatientData(data)
    setFormData(prev => ({
      ...prev,
      vitals: {
        ...prev.vitals,
        age: data.age,
        gender: data.gender,
        systolicBP: data.systolicBP,
        diastolicBP: data.diastolicBP,
        heartRate: data.heartRate,
        temperature: data.temperature
      }
    }))
    setScreen('welcome')
  }

  const handleVitalsComplete = (vitals: VitalsData) => {
    setFormData(prev => ({ ...prev, vitals }))
    setScreen('symptoms')
  }

  const handleSymptomsComplete = (symptoms: string[]) => {
    setFormData(prev => ({ ...prev, symptoms }))
    setScreen('history')
  }

  const handleHistoryComplete = (preExisting: string, document: any) => {
    setFormData(prev => ({
      ...prev,
      preExisting,
      medicalDocument: document
    }))
    setScreen('review')
  }

  const handleReviewComplete = () => {
    setScreen('prediction')
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {screen === 'splash' && (
          <SplashScreen key="splash" language={language} setLanguage={setLanguage} />
        )}
        
        {screen === 'login' && (
          <LoginScreen key="login" language={language} onLogin={handleLogin} />
        )}
        
        {screen === 'welcome' && patientData && (
          <WelcomeScreen 
            key="welcome" 
            language={language}
            patientData={patientData}
            wearableConnected={wearableConnected}
            setWearableConnected={setWearableConnected}
            demoMode={demoMode}
            setDemoMode={setDemoMode}
            onCheckHealth={() => setScreen('vitals')}
          />
        )}
        
        {screen === 'vitals' && (
          <VitalsScreen
            key="vitals"
            language={language}
            initialVitals={formData.vitals}
            wearableConnected={wearableConnected}
            setWearableConnected={setWearableConnected}
            demoMode={demoMode}
            setDemoMode={setDemoMode}
            onBack={() => setScreen('welcome')}
            onContinue={handleVitalsComplete}
          />
        )}
        
        {screen === 'symptoms' && (
          <SymptomsScreen
            key="symptoms"
            language={language}
            initialSymptoms={formData.symptoms}
            onBack={() => setScreen('vitals')}
            onContinue={handleSymptomsComplete}
          />
        )}
        
        {screen === 'history' && (
          <MedicalHistoryScreen
            key="history"
            language={language}
            initialPreExisting={formData.preExisting}
            initialDocument={formData.medicalDocument}
            onBack={() => setScreen('symptoms')}
            onContinue={handleHistoryComplete}
          />
        )}
        
        {screen === 'review' && (
          <ReviewScreen
            key="review"
            language={language}
            formData={formData}
            patientData={patientData}
            onBack={() => setScreen('history')}
            onContinue={handleReviewComplete}
          />
        )}
        
        {screen === 'prediction' && (
          <RiskPredictionScreen
            key="prediction"
            language={language}
            formData={formData}
            patientData={patientData}
            onNewPatient={() => {
              setScreen('login')
              setPatientData(null)
              setWearableConnected(false)
              setDemoMode(false)
              setFormData({
                vitals: {
                  age: 30,
                  gender: 'Male',
                  systolicBP: 120,
                  diastolicBP: 80,
                  heartRate: 72,
                  temperature: 37.0,
                  respiratoryRate: 16,
                  oxygenSaturation: 98
                },
                symptoms: [],
                preExisting: 'No History',
                medicalDocument: null
              })
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
