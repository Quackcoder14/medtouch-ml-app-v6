'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, LogIn } from 'lucide-react'
import { Language, PatientData } from '@/app/page'
import { getTranslation } from '@/utils/translations'

interface LoginScreenProps {
  language: Language
  onLogin: (data: PatientData) => void
}

export default function LoginScreen({ language, onLogin }: LoginScreenProps) {
  const [patientId, setPatientId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [patients, setPatients] = useState<PatientData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load patient data from CSV
    setLoading(true)
    fetch('/data/patients.csv')
      .then(res => res.text())
      .then(text => {
        // Handle different line endings (Windows \r\n, Unix \n, Mac \r)
        const lines = text.split(/\r?\n/).filter(line => line.trim())
        
        // Skip header
        const patientData = lines.slice(1).map(line => {
          // Split by comma and trim each value
          const values = line.split(',').map(v => v.trim())
          
          if (!values[0]) return null
          
          return {
            patientId: values[0],
            age: parseInt(values[1]) || 0,
            gender: values[2] || 'Male',
            systolicBP: parseInt(values[3]) || 120,
            diastolicBP: parseInt(values[4]) || 80,
            heartRate: parseInt(values[5]) || 72,
            temperature: parseFloat(values[6]) || 37.0,
            symptoms: values[7] ? values[7].split(';').map(s => s.trim()) : ['Cough'],
            preExisting: values[8] || 'No History',
            riskLevel: values[9] || 'Low',
            department: values[10]?.trim() || 'General Medicine'
          }
        }).filter(p => p !== null && p.patientId) as PatientData[]
        
        setPatients(patientData)
        setLoading(false)
        console.log(`Loaded ${patientData.length} patients`)
        console.log('First patient:', patientData[0])
      })
      .catch(err => {
        console.error('Error loading patients:', err)
        setError('Failed to load patient data')
        setLoading(false)
      })
  }, [])

  const handleLogin = () => {
    if (!patientId || !password) {
      setError(getTranslation(language, 'invalidCredentials'))
      return
    }

    // Simple authentication - password is 'abcd'
    if (password !== 'abcd') {
      setError(getTranslation(language, 'invalidCredentials'))
      console.log('Invalid password')
      return
    }

    console.log('Looking for patient:', patientId)
    console.log('Total patients loaded:', patients.length)
    console.log('Sample patient IDs:', patients.slice(0, 5).map(p => p.patientId))
    
    const patient = patients.find(p => p.patientId.trim() === patientId.trim())
    
    if (!patient) {
      setError(getTranslation(language, 'invalidCredentials'))
      console.log('Patient not found. Available IDs:', patients.slice(0, 10).map(p => p.patientId))
      return
    }

    console.log('Login successful for:', patient)
    onLogin(patient)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-8"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-deep-navy mb-2">
              {getTranslation(language, 'login')}
            </h2>
            <p className="text-charcoal opacity-70">
              {getTranslation(language, 'appTitle')}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
            >
              {error}
            </motion.div>
          )}

          {loading && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4">
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"
                />
                <span>Loading patient database...</span>
              </div>
            </div>
          )}

          {!loading && patients.length > 0 && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              ✓ {patients.length.toLocaleString()} patients loaded successfully
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-deep-navy mb-2">
                {getTranslation(language, 'patientId')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal w-5 h-5" />
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => {
                    setPatientId(e.target.value)
                    setError('')
                  }}
                  placeholder={getTranslation(language, 'enterPatientId')}
                  className="w-full pl-12 pr-4 py-3 border-2 border-powder-blue rounded-lg focus:border-deep-navy focus:outline-none transition-colors"
                />
              </div>
              <p className="text-xs text-charcoal opacity-60 mt-1">
                Example: PT2026000000
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-deep-navy mb-2">
                {getTranslation(language, 'password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  placeholder={getTranslation(language, 'enterPassword')}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full pl-12 pr-4 py-3 border-2 border-powder-blue rounded-lg focus:border-deep-navy focus:outline-none transition-colors"
                />
              </div>
              <p className="text-xs text-charcoal opacity-60 mt-1">
                Default password: abcd
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 shadow-lg transition-shadow ${
                loading 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-deep-navy to-charcoal text-white hover:shadow-xl'
              }`}
            >
              <LogIn className="w-5 h-5" />
              <span>{getTranslation(language, 'loginButton')}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
