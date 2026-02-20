'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, User, Activity, Stethoscope, FileText } from 'lucide-react'
import { Language, FormData, PatientData } from '@/app/page'
import { getTranslation } from '@/utils/translations'

interface ReviewScreenProps {
  language: Language
  formData: FormData
  patientData: PatientData | null
  onBack: () => void
  onContinue: () => void
}

export default function ReviewScreen({
  language,
  formData,
  patientData,
  onBack,
  onContinue
}: ReviewScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-8"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-deep-navy mb-2">
            {getTranslation(language, 'reviewTitle')}
          </h1>
          <p className="text-lg text-charcoal opacity-80">
            {getTranslation(language, 'reviewSubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Patient Information */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-powder-blue rounded-xl">
                <User className="w-6 h-6 text-deep-navy" />
              </div>
              <h3 className="text-xl font-bold text-deep-navy">
                {getTranslation(language, 'patientInfo')}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-light-powder rounded-lg">
                <span className="text-charcoal opacity-70">Patient ID:</span>
                <span className="font-semibold text-deep-navy">{patientData?.patientId}</span>
              </div>
              <div className="flex justify-between p-3 bg-light-powder rounded-lg">
                <span className="text-charcoal opacity-70">{getTranslation(language, 'age')}:</span>
                <span className="font-semibold text-deep-navy">{formData.vitals.age} {getTranslation(language, 'years')}</span>
              </div>
              <div className="flex justify-between p-3 bg-light-powder rounded-lg">
                <span className="text-charcoal opacity-70">{getTranslation(language, 'gender')}:</span>
                <span className="font-semibold text-deep-navy">{formData.vitals.gender}</span>
              </div>
            </div>
          </motion.div>

          {/* Vital Signs */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-powder-blue rounded-xl">
                <Activity className="w-6 h-6 text-deep-navy" />
              </div>
              <h3 className="text-xl font-bold text-deep-navy">
                {getTranslation(language, 'vitalSigns')}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-light-powder rounded-lg">
                <span className="text-charcoal opacity-70">Blood Pressure:</span>
                <span className="font-semibold text-deep-navy">
                  {Math.round(formData.vitals.systolicBP)}/{Math.round(formData.vitals.diastolicBP)} mmHg
                </span>
              </div>
              <div className="flex justify-between p-3 bg-light-powder rounded-lg">
                <span className="text-charcoal opacity-70">Heart Rate:</span>
                <span className="font-semibold text-deep-navy">{Math.round(formData.vitals.heartRate)} BPM</span>
              </div>
              <div className="flex justify-between p-3 bg-light-powder rounded-lg">
                <span className="text-charcoal opacity-70">Temperature:</span>
                <span className="font-semibold text-deep-navy">{formData.vitals.temperature.toFixed(1)}°C</span>
              </div>
              <div className="flex justify-between p-3 bg-light-powder rounded-lg">
                <span className="text-charcoal opacity-70">SpO2:</span>
                <span className="font-semibold text-deep-navy">{formData.vitals.oxygenSaturation.toFixed(1)}%</span>
              </div>
            </div>
          </motion.div>

          {/* Symptoms */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-powder-blue rounded-xl">
                <Stethoscope className="w-6 h-6 text-deep-navy" />
              </div>
              <h3 className="text-xl font-bold text-deep-navy">
                {getTranslation(language, 'selectedSymptoms')}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.symptoms.map((symptom, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-light-powder text-deep-navy rounded-lg font-semibold text-sm"
                >
                  {symptom}
                </span>
              ))}
            </div>
            {formData.symptoms.length === 0 && (
              <p className="text-charcoal opacity-70 text-center py-4">No symptoms selected</p>
            )}
          </motion.div>

          {/* Medical History */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-powder-blue rounded-xl">
                <FileText className="w-6 h-6 text-deep-navy" />
              </div>
              <h3 className="text-xl font-bold text-deep-navy">
                {getTranslation(language, 'medicalHistory')}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-light-powder rounded-lg">
                <p className="text-sm text-charcoal opacity-70 mb-1">Pre-existing Condition:</p>
                <p className="font-semibold text-deep-navy">{formData.preExisting}</p>
              </div>
              {formData.medicalDocument && (
                <div className="p-3 bg-light-powder rounded-lg">
                  <p className="text-sm text-charcoal opacity-70 mb-1">Uploaded Document:</p>
                  <p className="font-semibold text-deep-navy">{formData.medicalDocument.name}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

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
            onClick={onContinue}
            className="px-8 py-3 bg-gradient-to-r from-deep-navy to-charcoal text-white rounded-xl font-semibold flex items-center space-x-2 shadow-lg"
          >
            <span>{getTranslation(language, 'submit')}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
