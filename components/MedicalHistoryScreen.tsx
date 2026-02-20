'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Upload, FileText, Check, X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { Language } from '@/app/page'
import { getTranslation } from '@/utils/translations'

interface MedicalHistoryScreenProps {
  language: Language
  initialPreExisting: string
  initialDocument: any
  onBack: () => void
  onContinue: (preExisting: string, document: any) => void
}

export default function MedicalHistoryScreen({
  language,
  initialPreExisting,
  initialDocument,
  onBack,
  onContinue
}: MedicalHistoryScreenProps) {
  const [preExisting, setPreExisting] = useState(initialPreExisting)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [documentSummary, setDocumentSummary] = useState<any>(null)

  const conditions = [
    'No History',
    'Diabetes',
    'Hypertension',
    'Heart Disease',
    'Asthma',
    'COPD',
    'Cancer',
    'Kidney Disease',
    'Liver Disease',
    'Thyroid Disorder',
    'Stroke History',
    'Allergies',
    'Arthritis',
    'Depression',
    'Anxiety'
  ]

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      analyzeDocument(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  })

  const analyzeDocument = async (file: File) => {
    setAnalyzing(true)
    
    // Simulate AI document analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock extracted data based on file
    const mockSummary = {
      detectedConditions: ['Hypertension', 'Diabetes'],
      vitals: {
        bloodPressure: '140/90 mmHg',
        heartRate: '85 BPM',
        temperature: '37.2°C',
        weight: '75 kg'
      },
      medications: ['Metformin 500mg', 'Lisinopril 10mg'],
      lastVisit: '2024-01-15',
      keyFindings: [
        'Patient shows controlled hypertension',
        'HbA1c levels at 6.8%',
        'Recommended continued monitoring'
      ]
    }
    
    setDocumentSummary(mockSummary)
    setAnalyzing(false)
  }

  const removeFile = () => {
    setUploadedFile(null)
    setDocumentSummary(null)
  }

  const handleContinue = () => {
    const documentData = uploadedFile ? {
      name: uploadedFile.name,
      content: 'file content',
      extractedData: documentSummary
    } : null
    
    onContinue(preExisting, documentData)
  }

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
            {getTranslation(language, 'historyTitle')}
          </h1>
          <p className="text-lg text-charcoal opacity-80">
            {getTranslation(language, 'historySubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Document Upload */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-xl font-bold text-deep-navy mb-4 flex items-center space-x-2">
              <Upload className="w-6 h-6" />
              <span>{getTranslation(language, 'uploadDocument')}</span>
            </h3>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragActive
                  ? 'border-deep-navy bg-light-powder'
                  : 'border-powder-blue hover:border-deep-navy hover:bg-light-powder'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-charcoal opacity-50" />
              <p className="text-deep-navy font-semibold mb-2">
                {getTranslation(language, 'dragDrop')}
              </p>
              <p className="text-sm text-charcoal opacity-70">
                {getTranslation(language, 'supportedFormats')}
              </p>
            </div>

            {uploadedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-light-powder rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6 text-deep-navy" />
                    <div>
                      <p className="font-semibold text-deep-navy">{uploadedFile.name}</p>
                      <p className="text-sm text-charcoal opacity-70">
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </motion.div>
            )}

            {analyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-light-powder rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-6 h-6 border-3 border-powder-blue border-t-deep-navy rounded-full"
                  />
                  <span className="text-deep-navy font-semibold">
                    {getTranslation(language, 'analyzing')}
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Pre-existing Conditions */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-xl font-bold text-deep-navy mb-4">
              {getTranslation(language, 'preExistingCondition')}
            </h3>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {conditions.map((condition) => {
                const isSelected = preExisting === condition
                return (
                  <motion.button
                    key={condition}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPreExisting(condition)}
                    className={`w-full p-3 rounded-xl font-semibold text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-deep-navy text-white shadow-lg'
                        : 'bg-light-powder text-deep-navy hover:bg-powder-blue'
                    }`}
                  >
                    <span>{condition}</span>
                    {isSelected && <Check className="w-5 h-5" />}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Document Summary */}
        {documentSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 mb-8"
          >
            <h3 className="text-xl font-bold text-deep-navy mb-4">
              {getTranslation(language, 'documentSummary')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Detected Conditions */}
              <div className="p-4 bg-light-powder rounded-xl">
                <h4 className="font-semibold text-deep-navy mb-3">Detected Conditions</h4>
                <div className="space-y-2">
                  {documentSummary.detectedConditions.map((condition: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-deep-navy rounded-full" />
                      <span className="text-charcoal">{condition}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vitals from Document */}
              <div className="p-4 bg-light-powder rounded-xl">
                <h4 className="font-semibold text-deep-navy mb-3">Extracted Vitals</h4>
                <div className="space-y-2">
                  {Object.entries(documentSummary.vitals).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-charcoal opacity-70 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-deep-navy font-semibold">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medications */}
              <div className="p-4 bg-light-powder rounded-xl">
                <h4 className="font-semibold text-deep-navy mb-3">Current Medications</h4>
                <div className="space-y-2">
                  {documentSummary.medications.map((med: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-charcoal">{med}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Findings */}
              <div className="p-4 bg-light-powder rounded-xl">
                <h4 className="font-semibold text-deep-navy mb-3">Key Findings</h4>
                <div className="space-y-2">
                  {documentSummary.keyFindings.map((finding: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                      <span className="text-charcoal text-sm">{finding}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

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
