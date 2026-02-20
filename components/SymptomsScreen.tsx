'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Mic, MicOff, Check } from 'lucide-react'
import { Language } from '@/app/page'
import { getTranslation } from '@/utils/translations'

interface SymptomsScreenProps {
  language: Language
  initialSymptoms: string[]
  onBack: () => void
  onContinue: (symptoms: string[]) => void
}

export default function SymptomsScreen({
  language,
  initialSymptoms,
  onBack,
  onContinue
}: SymptomsScreenProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(initialSymptoms)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [recognition, setRecognition] = useState<any>(null)

  const allSymptoms = [
    'Fever', 'Cough', 'Difficulty Breathing', 'Chest Pain', 'Headache',
    'Severe Headache', 'Nausea', 'Vomiting', 'Abdominal Pain', 'Severe Abdominal Pain',
    'Fatigue', 'Dizziness', 'Back Pain', 'Joint Pain', 'Muscle Pain',
    'Sore Throat', 'Runny Nose', 'Congestion', 'Sneezing', 'Loss of Taste',
    'Loss of Smell', 'Rash', 'Itching', 'Swelling', 'Bleeding',
    'Bruising', 'Numbness', 'Tingling', 'Confusion', 'Memory Loss',
    'Vision Problems', 'Hearing Loss', 'Ear Pain', 'Tooth Pain', 'Jaw Pain',
    'Heart Palpitations', 'Irregular Heartbeat', 'Shortness of Breath', 'Wheezing',
    'Loss of Consciousness', 'Seizures', 'Tremors', 'Weakness', 'Paralysis',
    'Cold Symptoms', 'Flu-Like Symptoms', 'Allergies', 'Minor Injury',
    'Stroke Symptoms', 'Anxiety', 'Depression', 'Insomnia', 'Night Sweats',
    'Weight Loss', 'Weight Gain', 'Appetite Loss', 'Excessive Thirst',
    'Frequent Urination', 'Blood in Urine', 'Blood in Stool', 'Constipation',
    'Diarrhea', 'Heartburn', 'Bloating', 'Gas'
  ]

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom))
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.')
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = true
    recognition.interimResults = true
    
    // Set language based on selected language
    const languageMap: Record<string, string> = {
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'ar': 'ar-SA'
    }
    recognition.lang = languageMap[language] || 'en-US'

    recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      setTranscript(finalTranscript || interimTranscript)

      // Map transcript to symptoms
      if (finalTranscript) {
        const text = finalTranscript.toLowerCase()
        const newSymptoms = [...selectedSymptoms]
        
        allSymptoms.forEach(symptom => {
          const symptomLower = symptom.toLowerCase()
          // Check English symptom
          if (text.includes(symptomLower) && !newSymptoms.includes(symptom)) {
            newSymptoms.push(symptom)
          }
          
          // Check common medical terms in different languages
          const translations: Record<string, string[]> = {
            'Fever': ['fiebre', 'fièvre', 'बुखार', 'காய்ச்சல்', 'حمى'],
            'Cough': ['tos', 'toux', 'खांसी', 'இருமல்', 'سعال'],
            'Headache': ['dolor de cabeza', 'mal de tête', 'सिरदर्द', 'தலைவலி', 'صداع'],
            'Difficulty Breathing': ['dificultad para respirar', 'difficulté à respirer', 'सांस लेने में कठिनाई', 'மூச்சுத்திணறல்', 'صعوبة في التنفس'],
            'Chest Pain': ['dolor en el pecho', 'douleur thoracique', 'सीने में दर्द', 'மார்பு வலி', 'ألم في الصدر'],
            'Nausea': ['náuseas', 'nausée', 'मतली', 'குமட்டல்', 'غثيان'],
            'Vomiting': ['vómitos', 'vomissement', 'उल्टी', 'வாந்தி', 'قيء'],
            'Fatigue': ['fatiga', 'fatigue', 'थकान', 'சோர்வு', 'تعب'],
            'Dizziness': ['mareos', 'vertige', 'चक्कर', 'தலைசுற்றல்', 'دوخة'],
            'Abdominal Pain': ['dolor abdominal', 'douleur abdominale', 'पेट दर्द', 'வயிற்று வலி', 'ألم في البطن']
          }
          
          const symptomTranslations = translations[symptom] || []
          for (const trans of symptomTranslations) {
            if (text.includes(trans.toLowerCase()) && !newSymptoms.includes(symptom)) {
              newSymptoms.push(symptom)
              break
            }
          }
        })
        
        setSelectedSymptoms(newSymptoms)
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'no-speech') {
        setTranscript('No speech detected. Please try again.')
      } else if (event.error === 'not-allowed') {
        setTranscript('Microphone permission denied. Please allow microphone access.')
      } else {
        setTranscript('Error: ' + event.error)
      }
      setIsListening(false)
    }

    recognition.onend = () => {
      if (isListening) {
        recognition.start()
      }
    }

    recognition.start()
    setRecognition(recognition)
    setIsListening(true)
  }

  const stopListening = () => {
    if (recognition) {
      recognition.stop()
      setRecognition(null)
    }
    setIsListening(false)
  }

  const handleContinue = () => {
    if (isListening) {
      stopListening()
    }
    onContinue(selectedSymptoms)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-deep-navy mb-2">
            {getTranslation(language, 'symptomsTitle')}
          </h1>
          <p className="text-lg text-charcoal opacity-80">
            {getTranslation(language, 'symptomsSubtitle')}
          </p>
        </motion.div>

        {/* Voice Input Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-deep-navy">
              {getTranslation(language, 'voiceInput')}
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isListening ? stopListening : startListening}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg transition-all ${
                isListening
                  ? 'bg-red-500 text-white'
                  : 'bg-gradient-to-r from-deep-navy to-charcoal text-white'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span>
                {isListening 
                  ? getTranslation(language, 'clickToStop')
                  : getTranslation(language, 'clickToSpeak')
                }
              </span>
            </motion.button>
          </div>

          {isListening && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-light-powder rounded-xl p-4"
            >
              <div className="flex items-center space-x-3 mb-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-3 h-3 bg-red-500 rounded-full"
                />
                <span className="text-deep-navy font-semibold">
                  {getTranslation(language, 'listening')}
                </span>
              </div>
              {transcript && (
                <p className="text-charcoal mt-2 p-3 bg-white rounded-lg">
                  {transcript}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Symptoms Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-deep-navy mb-4">
            {getTranslation(language, 'selectSymptoms')}
          </h3>
          
          <div className="mb-4 p-3 bg-light-powder rounded-lg">
            <p className="text-sm text-deep-navy font-semibold">
              Selected: {selectedSymptoms.length} {selectedSymptoms.length === 1 ? 'symptom' : 'symptoms'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-2">
            {allSymptoms.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom)
              return (
                <motion.button
                  key={symptom}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleSymptom(symptom)}
                  className={`p-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-deep-navy text-white shadow-lg'
                      : 'bg-light-powder text-deep-navy hover:bg-powder-blue'
                  }`}
                >
                  <span className="text-left">{symptom}</span>
                  {isSelected && <Check className="w-4 h-4 ml-2 flex-shrink-0" />}
                </motion.button>
              )
            })}
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
            disabled={selectedSymptoms.length === 0}
            className={`px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg ${
              selectedSymptoms.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-deep-navy to-charcoal text-white'
            }`}
          >
            <span>{getTranslation(language, 'continue')}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
