'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface RiskGaugeProps {
  riskScore: number // 0-100
  riskLevel: 'Low' | 'Medium' | 'High'
}

export default function RiskGauge({ riskScore, riskLevel }: RiskGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(riskScore)
    }, 500)
    return () => clearTimeout(timer)
  }, [riskScore])

  // Calculate needle rotation (-90 to 90 degrees for 180-degree arc)
  const needleRotation = (animatedScore / 100) * 180 - 90

  const getRiskColor = () => {
    if (riskLevel === 'High') return '#ef4444'
    if (riskLevel === 'Medium') return '#f59e0b'
    return '#10b981'
  }

  // Calculate which segment the needle is in
  const getActiveSegment = () => {
    if (animatedScore < 33.33) return 0 // Low
    if (animatedScore < 66.66) return 1 // Medium
    return 2 // High
  }

  return (
    <div className="relative w-full max-w-md mx-auto py-8">
      {/* SVG Gauge - Arc only, no base */}
      <svg viewBox="0 0 200 110" className="w-full" style={{ overflow: 'visible' }}>
        <defs>
          {/* Gradient for glow effect */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background arc segments - Three colors */}
        {/* Low segment (Green) - 0 to 60 degrees */}
        <path
          d="M 30,100 A 70,70 0 0,1 100,30"
          fill="none"
          stroke="#10b981"
          strokeWidth="20"
          strokeLinecap="round"
          opacity={getActiveSegment() === 0 ? "1" : "0.25"}
          style={{ transition: 'opacity 0.5s ease' }}
        />
        
        {/* Medium segment (Yellow) - 60 to 120 degrees */}
        <path
          d="M 100,30 A 70,70 0 0,1 170,100"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="20"
          strokeLinecap="round"
          opacity={getActiveSegment() === 1 ? "1" : "0.25"}
          style={{ transition: 'opacity 0.5s ease' }}
        />
        
        {/* High segment (Red) - 120 to 180 degrees */}
        <path
          d="M 170,100 A 70,70 0 0,1 170,100"
          fill="none"
          stroke="#ef4444"
          strokeWidth="20"
          strokeLinecap="round"
          opacity={getActiveSegment() === 2 ? "1" : "0.25"}
          style={{ transition: 'opacity 0.5s ease' }}
        />

        {/* Animated progress arc */}
        <motion.circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke={getRiskColor()}
          strokeWidth="22"
          strokeLinecap="round"
          strokeDasharray="220"
          strokeDashoffset={220}
          initial={{ strokeDashoffset: 220 }}
          animate={{ strokeDashoffset: 220 - (animatedScore / 100) * 220 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          transform="rotate(-90 100 100)"
          filter="url(#glow)"
        />

        {/* Center pivot point */}
        <circle cx="100" cy="100" r="6" fill="#1B3A52" />

        {/* Needle */}
        <motion.g
          initial={{ rotate: -90 }}
          animate={{ rotate: needleRotation }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
          style={{ transformOrigin: '100px 100px', transformBox: 'fill-box' }}
        >
          {/* Needle shadow for depth */}
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="38"
            stroke="#00000030"
            strokeWidth="4"
            strokeLinecap="round"
            transform="translate(2, 2)"
          />
          {/* Main needle */}
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="35"
            stroke="#1B3A52"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Needle tip */}
          <circle cx="100" cy="35" r="3" fill={getRiskColor()} />
        </motion.g>

        {/* Tick marks */}
        {[0, 33.33, 66.66, 100].map((value, index) => {
          const angle = (value / 100) * 180 - 90
          const radian = (angle * Math.PI) / 180
          const x1 = 100 + 75 * Math.cos(radian)
          const y1 = 100 + 75 * Math.sin(radian)
          const x2 = 100 + 85 * Math.cos(radian)
          const y2 = 100 + 85 * Math.sin(radian)
          
          return (
            <line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#36454F"
              strokeWidth="2"
              opacity="0.5"
            />
          )
        })}

        {/* Labels */}
        <text x="25" y="108" className="text-xs fill-green-600 font-semibold" textAnchor="middle">LOW</text>
        <text x="100" y="20" className="text-xs fill-yellow-600 font-semibold" textAnchor="middle">MED</text>
        <text x="175" y="108" className="text-xs fill-red-600 font-semibold" textAnchor="middle">HIGH</text>
      </svg>

      {/* Score display below the gauge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-2"
      >
        <div className="text-5xl font-bold" style={{ color: getRiskColor() }}>
          {Math.round(animatedScore)}
        </div>
        <div className="text-sm text-gray-600 font-semibold mt-1">Risk Score</div>
      </motion.div>
    </div>
  )
}
