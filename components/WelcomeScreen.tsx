'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Watch, TrendingUp, Activity, Heart, Thermometer, Zap } from 'lucide-react'
import { Language, PatientData } from '@/app/page'
import { getTranslation } from '@/utils/translations'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

interface WelcomeScreenProps {
  language: Language
  patientData: PatientData
  wearableConnected: boolean
  setWearableConnected: (connected: boolean) => void
  demoMode: boolean
  setDemoMode: (demo: boolean) => void
  onCheckHealth: () => void
}

export default function WelcomeScreen({
  language,
  patientData,
  wearableConnected,
  setWearableConnected,
  demoMode,
  setDemoMode,
  onCheckHealth
}: WelcomeScreenProps) {
  const [showDevices, setShowDevices] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  
  // Live/Demo data
  const [heartRate, setHeartRate] = useState(patientData.heartRate)
  const [temperature, setTemperature] = useState(patientData.temperature)
  const [systolicBP, setSystolicBP] = useState(patientData.systolicBP)
  const [diastolicBP, setDiastolicBP] = useState(patientData.diastolicBP)
  
  // Historical data for charts
  const [heartRateHistory, setHeartRateHistory] = useState(
    Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      value: patientData.heartRate + Math.random() * 10 - 5
    }))
  )
  
  const [bpHistory, setBpHistory] = useState(
    Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      systolic: patientData.systolicBP + Math.random() * 10 - 5,
      diastolic: patientData.diastolicBP + Math.random() * 5 - 2.5
    }))
  )

  const devices = [
    { id: '1', name: 'Apple Watch Series 9', icon: '⌚', battery: 85 },
    { id: '2', name: 'Samsung Galaxy Watch', icon: '⌚', battery: 72 },
    { id: '3', name: 'Fitbit Sense 2', icon: '⌚', battery: 91 },
    { id: '4', name: 'Garmin Venu 3', icon: '⌚', battery: 68 }
  ]

  const handleConnectWearable = () => {
    setShowDevices(true)
  }

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId)
    setConnecting(true)
    
    setTimeout(() => {
      setWearableConnected(true)
      setConnecting(false)
      setShowDevices(false)
      setDemoMode(false)
    }, 2000)
  }

  const handleDemoMode = () => {
    if (!demoMode) {
      setDemoMode(true)
      setWearableConnected(false)
    } else {
      setDemoMode(false)
    }
  }

  // Simulate live data updates for wearable/demo mode
  useEffect(() => {
    if (!wearableConnected && !demoMode) return

    const interval = setInterval(() => {
      // Small realistic variations
      setHeartRate(prev => {
        const change = (Math.random() - 0.5) * 3
        return Math.max(60, Math.min(100, prev + change))
      })
      
      setTemperature(prev => {
        const change = (Math.random() - 0.5) * 0.2
        return Math.max(36.5, Math.min(38.0, prev + change))
      })
      
      setSystolicBP(prev => {
        const change = (Math.random() - 0.5) * 2
        return Math.max(110, Math.min(140, prev + change))
      })
      
      setDiastolicBP(prev => {
        const change = (Math.random() - 0.5) * 1.5
        return Math.max(70, Math.min(90, prev + change))
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [wearableConnected, demoMode])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-deep-navy mb-2">
            {getTranslation(language, 'welcomeBack')}
          </h1>
          <p className="text-2xl text-charcoal opacity-80">
            {patientData.patientId}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center space-x-4 mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleConnectWearable}
            disabled={wearableConnected}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg transition-all ${
              wearableConnected
                ? 'bg-green-500 text-white cursor-not-allowed'
                : 'bg-white text-deep-navy hover:bg-powder-blue'
            }`}
          >
            <Watch className="w-5 h-5" />
            <span>
              {wearableConnected 
                ? getTranslation(language, 'connected')
                : getTranslation(language, 'connectWearable')
              }
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDemoMode}
            disabled={wearableConnected}
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

        {/* Device Selection Modal */}
        <AnimatePresence>
          {showDevices && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8"
              onClick={() => !connecting && setShowDevices(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-8 max-w-md w-full"
              >
                <h3 className="text-2xl font-bold text-deep-navy mb-6">
                  {getTranslation(language, 'nearbyDevices')}
                </h3>
                
                {connecting ? (
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-16 h-16 border-4 border-powder-blue border-t-deep-navy rounded-full mx-auto mb-4"
                    />
                    <p className="text-charcoal">{getTranslation(language, 'connecting')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {devices.map((device) => (
                      <motion.button
                        key={device.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDeviceSelect(device.id)}
                        className="w-full p-4 bg-light-powder rounded-xl hover:bg-powder-blue transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{device.icon}</span>
                          <div className="text-left">
                            <p className="font-semibold text-deep-navy">{device.name}</p>
                            <p className="text-sm text-charcoal">Battery: {device.battery}%</p>
                          </div>
                        </div>
                        <Watch className="w-5 h-5 text-deep-navy" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Data Display Mode Indicator */}
        {(wearableConnected || demoMode) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <span className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
              <Zap className="w-4 h-4" />
              <span>{getTranslation(language, 'liveData')}</span>
            </span>
          </motion.div>
        )}

        {/* Past Data / Live Data Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Heart Rate Card */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-100 rounded-xl">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-charcoal opacity-70">Heart Rate</p>
                  <p className="text-3xl font-bold text-deep-navy">
                    {Math.round(heartRate)} <span className="text-lg font-normal">BPM</span>
                  </p>
                </div>
              </div>
            </div>
            
            {(wearableConnected || demoMode) ? (
              <div className="h-24 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 60 / heartRate, repeat: Infinity }}
                  className="text-6xl"
                >
                  ❤️
                </motion.div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={heartRateHistory.slice(-15)}>
                  <defs>
                    <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#ef4444" fill="url(#heartGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Blood Pressure Card */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Activity className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-charcoal opacity-70">Blood Pressure</p>
                  <p className="text-3xl font-bold text-deep-navy">
                    {Math.round(systolicBP)}/{Math.round(diastolicBP)}
                    <span className="text-lg font-normal ml-1">mmHg</span>
                  </p>
                </div>
              </div>
            </div>
            
            {!(wearableConnected || demoMode) && (
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={bpHistory.slice(-15)}>
                  <Line type="monotone" dataKey="systolic" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="diastolic" stroke="#60a5fa" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Temperature Card */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Thermometer className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-charcoal opacity-70">Temperature</p>
                <p className="text-3xl font-bold text-deep-navy">
                  {temperature.toFixed(1)} <span className="text-lg font-normal">°C</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Activity Summary Card */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-charcoal opacity-70">Overall Status</p>
                <p className="text-2xl font-bold text-green-600">
                  {patientData.riskLevel === 'Low' ? 'Good' : patientData.riskLevel === 'Medium' ? 'Fair' : 'Critical'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Check Health Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCheckHealth}
            className="px-12 py-4 bg-gradient-to-r from-deep-navy to-charcoal text-white rounded-xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-shadow"
          >
            {getTranslation(language, 'checkHealth')}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
