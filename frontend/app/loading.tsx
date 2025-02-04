'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const loadingTexts = [
  'Bidding time! 🕒',
  'Let’s hope your internet is faster than your bid! ⚡',
  'Let’s go! 🚀',
  'Bid now or regret later! 😅',
  'Who’s winning? 🤔',
  'Hold my coffee, I’m bidding! ☕💻',
  'Bids incoming! 💥',
  'Time to bid! ⏳',
  'Let’s make it rain! 🌧️💸',
  'Winning starts now! 🏆',
  'Get your bid on! 👏',
  'Game on! 🎮',
];

export default function Loading() {
  const [mounted, setMounted] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 to-indigo-900 flex flex-col items-center justify-center overflow-hidden z-[999]">
      <div className="relative w-32 h-32 sm:w-24 sm:h-24 mb-8">
        <motion.div
          className="absolute inset-0 bg-pink-500 rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute inset-4 bg-yellow-400 rounded-full opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute inset-8 bg-blue-500 rounded-full opacity-20"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute inset-0 border-4 border-white rounded-full"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          }}
        >
          <motion.div
            className="w-2 h-3 bg-white rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={textIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className=" font-semibold text-xs sm:text-sm md:text-md lg:text-xl text-white mb-4 tracking-tight">
            {loadingTexts[textIndex]}
          </h2>
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="mt-4 sm:mt-6 text-white text-xs sm:text-sm md:text-base lg:text-xl font-medium"
        animate={{
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      >
        Loading amazing auctions...
      </motion.div>
    </div>
  );
}
