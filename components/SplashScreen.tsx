'use client'

import { motion } from 'framer-motion'
import { Heart, Activity } from 'lucide-react'
import { Language } from '@/app/page'
import { getTranslation } from '@/utils/translations'

interface SplashScreenProps {
  language: Language
  setLanguage: (lang: Language) => void
}

export default function SplashScreen({ language, setLanguage }: SplashScreenProps) {
  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-8"
    >
      {/* Animated Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
        className="relative mb-8"
      >
        <div className="relative">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-powder-blue rounded-full opacity-20 blur-xl"
          />
          <div className="relative bg-white p-8 rounded-3xl shadow-2xl">
            <Heart className="w-24 h-24 text-deep-navy" strokeWidth={1.5} />
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <Activity className="w-12 h-12 text-powder-blue" strokeWidth={2} />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* App Name */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl font-bold text-deep-navy mb-2">
          {getTranslation(language, 'appTitle')}
        </h1>
        <p className="text-xl text-charcoal opacity-80">
          {getTranslation(language, 'tagline')}
        </p>
      </motion.div>

      {/* Language Selector */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md"
      >
        <p className="text-center text-deep-navy font-semibold mb-4">
          {getTranslation(language, 'selectLanguage')}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {languages.map((lang) => (
            <motion.button
              key={lang.code}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLanguage(lang.code)}
              className={`p-4 rounded-xl transition-all ${
                language === lang.code
                  ? 'bg-deep-navy text-white shadow-lg'
                  : 'bg-white text-deep-navy hover:bg-powder-blue'
              }`}
            >
              <span className="text-2xl mr-2">{lang.flag}</span>
              <span className="font-semibold">{lang.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Loading Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12"
      >
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-3 h-3 bg-powder-blue rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
