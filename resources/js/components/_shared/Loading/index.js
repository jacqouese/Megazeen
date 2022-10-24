import { motion } from 'framer-motion';

function Loading() {
  return (
    <div className="loading-container">
      <motion.div
        style={{ scale: 0 }}
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 0, 270, 270, 0],
          borderRadius: ['20%', '20%', '50%', '50%', '20%'],
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 1,
          delay: 0.5,
        }}
        className="loading"
      />
      <motion.p
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      >
        Trwa ładowanie danych
      </motion.p>
    </div>
  );
}

export default Loading;
