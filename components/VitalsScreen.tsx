'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Activity, Heart, Thermometer, Wind, Droplets } from 'lucide-react'
import { Language, VitalsData } from '@/app/page'
import { getTranslation } from '@/utils/translations'

interface VitalsScreenProps {
  language: Language
  initialVitals: VitalsData
  wearableConnected: boolean
  setWearableConnected: (connected: boolean) => void
  demoMode: boolean
  setDemoMode: (demo: boolean) => void
  onBack: () => void
  onContinue: (vitals: VitalsData) => void
}

export default function VitalsScreen({
  language,
  initialVitals,
  wearableConnected,
  setWearableConnected,
  demoMode,
  setDemoMode,
  onBack,
  onContinue
}: VitalsScreenProps) {
  const [vitals, setVitals] = useState<VitalsData>(initialVitals)
  const [isLive, setIsLive] = useState(wearableConnected || demoMode)

  useEffect(() => {
    setIsLive(wearableConnected || demoMode)
  }, [wearableConnected, demoMode])

  // Simulate live data updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setVitals(prev => ({
        ...prev,
        heartRate: Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 3)),
        temperature: Math.max(36.5, Math.min(38.0, prev.temperature + (Math.random() - 0.5) * 0.2)),
        systolicBP: Math.max(110, Math.min(140, prev.systolicBP + (Math.random() - 0.5) * 2)),
        diastolicBP: Math.max(70, Math.min(90, prev.diastolicBP + (Math.random() - 0.5) * 1.5)),
        respiratoryRate: Math.max(12, Math.min(20, prev.respiratoryRate + (Math.random() - 0.5) * 1)),
        oxygenSaturation: Math.max(95, Math.min(100, prev.oxygenSaturation + (Math.random() - 0.5) * 0.5))
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [isLive])

  const handleDemoMode = () => {
    const newDemoMode = !demoMode
    setDemoMode(newDemoMode)
    setIsLive(wearableConnected || newDemoMode)
  }

  const handleContinue = () => {
    // Stop live updates
    setIsLive(false)
    setDemoMode(false)
    onContinue(vitals)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-deep-navy mb-2">
            {getTranslation(language, 'vitalsTitle')}
          </h1>
          <p className="text-lg text-charcoal opacity-80">
            {getTranslation(language, 'vitalsSubtitle')}
          </p>
        </motion.div>

        {/* Demo Mode Toggle */}
        {!wearableConnected && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-center mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDemoMode}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg transition-all ${
                demoMode
                  ? 'bg-powder-blue text-deep-navy'
                  : 'bg-white text-deep-navy hover:bg-powder-blue'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span>{getTranslation(language, 'demoMode')}</span>
            </motion.button>
          </motion.div>
        )}

        {/* Vitals Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Age */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-deep-navy mb-3">
                <span>{getTranslation(language, 'age')}</span>
              </label>
              <input
                type="range"
                min="1"
                max="120"
                value={vitals.age}
                onChange={(e) => setVitals({...vitals, age: parseInt(e.target.value)})}
                disabled={isLive}
                className="w-full h-2 bg-powder-blue rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between mt-2">
                <span className="text-2xl font-bold text-deep-navy">{vitals.age}</span>
                <span className="text-sm text-charcoal">{getTranslation(language, 'years')}</span>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-deep-navy mb-3">
                {getTranslation(language, 'gender')}
              </label>
              <div className="flex space-x-4">
                {['Male', 'Female'].map((gender) => (
                  <motion.button
                    key={gender}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setVitals({...vitals, gender})}
                    disabled={isLive}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                      vitals.gender === gender
                        ? 'bg-deep-navy text-white'
                        : 'bg-light-powder text-deep-navy hover:bg-powder-blue'
                    }`}
                  >
                    {getTranslation(language, gender.toLowerCase())}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Heart Rate */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-deep-navy mb-3">
                <Heart className="w-4 h-4 text-red-500" />
                <span>{getTranslation(language, 'heartRate')}</span>
              </label>
              <input
                type="range"
                min="40"
                max="200"
                value={vitals.heartRate}
                onChange={(e) => setVitals({...vitals, heartRate: parseInt(e.target.value)})}
                disabled={isLive}
                className="w-full h-2 bg-powder-blue rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between mt-2">
                <span className="text-2xl font-bold text-deep-navy">{Math.round(vitals.heartRate)}</span>
                <span className="text-sm text-charcoal">{getTranslation(language, 'bpm')}</span>
              </div>
            </div>

            {/* Temperature */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-deep-navy mb-3">
                <Thermometer className="w-4 h-4 text-orange-500" />
                <span>{getTranslation(language, 'temperature')}</span>
              </label>
              <input
                type="range"
                min="35"
                max="42"
                step="0.1"
                value={vitals.temperature}
                onChange={(e) => setVitals({...vitals, temperature: parseFloat(e.target.value)})}
                disabled={isLive}
                className="w-full h-2 bg-powder-blue rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between mt-2">
                <span className="text-2xl font-bold text-deep-navy">{vitals.temperature.toFixed(1)}</span>
                <span className="text-sm text-charcoal">{getTranslation(language, 'celsius')}</span>
              </div>
            </div>

            {/* Systolic BP */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-deep-navy mb-3">
                <Activity className="w-4 h-4 text-blue-500" />
                <span>{getTranslation(language, 'systolic')}</span>
              </label>
              <input
                type="range"
                min="70"
                max="200"
                value={vitals.systolicBP}
                onChange={(e) => setVitals({...vitals, systolicBP: parseInt(e.target.value)})}
                disabled={isLive}
                className="w-full h-2 bg-powder-blue rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between mt-2">
                <span className="text-2xl font-bold text-deep-navy">{Math.round(vitals.systolicBP)}</span>
                <span className="text-sm text-charcoal">mmHg</span>
              </div>
            </div>

            {/* Diastolic BP */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-deep-navy mb-3">
                <Activity className="w-4 h-4 text-blue-400" />
                <span>{getTranslation(language, 'diastolic')}</span>
              </label>
              <input
                type="range"
                min="40"
                max="130"
                value={vitals.diastolicBP}
                onChange={(e) => setVitals({...vitals, diastolicBP: parseInt(e.target.value)})}
                disabled={isLive}
                className="w-full h-2 bg-powder-blue rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between mt-2">
                <span className="text-2xl font-bold text-deep-navy">{Math.round(vitals.diastolicBP)}</span>
                <span className="text-sm text-charcoal">mmHg</span>
              </div>
            </div>

            {/* Respiratory Rate */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-deep-navy mb-3">
                <Wind className="w-4 h-4 text-teal-500" />
                <span>{getTranslation(language, 'respiratoryRate')}</span>
              </label>
              <input
                type="range"
                min="8"
                max="30"
                value={vitals.respiratoryRate}
                onChange={(e) => setVitals({...vitals, respiratoryRate: parseInt(e.target.value)})}
                disabled={isLive}
                className="w-full h-2 bg-powder-blue rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between mt-2">
                <span className="text-2xl font-bold text-deep-navy">{Math.round(vitals.respiratoryRate)}</span>
                <span className="text-sm text-charcoal">{getTranslation(language, 'breathsPerMin')}</span>
              </div>
            </div>

            {/* Oxygen Saturation */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-deep-navy mb-3">
                <Droplets className="w-4 h-4 text-cyan-500" />
                <span>{getTranslation(language, 'oxygenSaturation')}</span>
              </label>
              <input
                type="range"
                min="80"
                max="100"
                step="0.1"
                value={vitals.oxygenSaturation}
                onChange={(e) => setVitals({...vitals, oxygenSaturation: parseFloat(e.target.value)})}
                disabled={isLive}
                className="w-full h-2 bg-powder-blue rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between mt-2">
                <span className="text-2xl font-bold text-deep-navy">{vitals.oxygenSaturation.toFixed(1)}</span>
                <span className="text-sm text-charcoal">%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="px-8 py-3 bg-white text-deep-navy rounded-xl font-semibold flex items-center space-x-2 shadow-lg hover:bg-powder-blue transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{getTranslation(language, 'back')}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            className="px-8 py-3 bg-gradient-to-r from-deep-navy to-charcoal text-white rounded-xl font-semibold flex items-center space-x-2 shadow-lg"
          >
            <span>{getTranslation(language, 'continue')}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
