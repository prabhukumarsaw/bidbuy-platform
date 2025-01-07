"use client"

import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const Particle = ({ x, y }: { x: number; y: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-blue-400 rounded-full"
    style={{ x, y }}
    animate={{
      x: x + Math.random() * 100 - 50,
      y: y + Math.random() * 100 - 50,
      opacity: [1, 0.8, 0.6, 0.4, 0.2, 0],
    }}
    transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
  />
)

export const AnimatedParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [particles, setParticles] = React.useState<{ x: number; y: number }[]>([])

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      const newParticles = Array.from({ length: 50 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
      }))
      setParticles(newParticles)
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 opacity-50">
      {particles.map((particle, index) => (
        <Particle key={index} x={particle.x} y={particle.y} />
      ))}
    </div>
  )
}

