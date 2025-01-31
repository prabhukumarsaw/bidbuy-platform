'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loading() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden z-[999]">
      <AnimatePresence>
        <motion.div
          key="splash"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
          className="relative"
        >
          <svg viewBox="0 0 100 100" className="w-64 h-64 md:w-96 md:h-96">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="0 1"
              filter="url(#glow)"
              animate={{
                strokeDasharray: ['1 0', '0 1'],
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'reverse',
              }}
            />
            <motion.path
              d="M20 80L80 20M50 90L90 50M10 50L50 10"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#glow)"
              animate={{
                pathLength: [0, 1],
                opacity: [0.2, 1],
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'reverse',
              }}
            />
            <motion.rect
              x="60"
              y="60"
              width="30"
              height="15"
              rx="2"
              fill="white"
              filter="url(#glow)"
              animate={{
                y: [60, 55, 60],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          </svg>
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="absolute bottom-10 left-0 right-0 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-4"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'reverse',
          }}
        >
          Auction Bidding
        </motion.h1>
        <div className="flex justify-center items-end space-x-2 h-12">
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.div
              key={index}
              className="w-6 bg-white rounded-t-full"
              animate={{
                height: ['20%', '100%', '20%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.2,
              }}
            >
              <motion.div
                className="w-full h-2 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: index * 0.2,
                }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
