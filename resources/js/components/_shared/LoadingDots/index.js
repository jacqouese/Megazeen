import React from 'react';
import { motion } from 'framer-motion';

function LoadingDots() {
  return (
    <div className="loading-dots-container">
      <motion.span
        animate={{
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 0.8,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
        className="loading-dot"
      />
      <motion.span
        animate={{
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 0.8,
          ease: 'easeInOut',
          repeat: Infinity,
          delay: 0.1,
        }}
        className="loading-dot"
      />
      <motion.span
        animate={{
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 0.8,
          ease: 'easeInOut',
          repeat: Infinity,
          delay: 0.2,
        }}
        className="loading-dot"
      />
    </div>
  );
}

export default LoadingDots;
