import { motion } from "framer-motion";

const NewYearGlowBadge = () => {
  return (
    <motion.div
      className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-sm border"
      style={{
        background: 'linear-gradient(to right, rgba(212, 175, 55, 0.1), rgba(230, 195, 92, 0.15), rgba(212, 175, 55, 0.1))',
        borderColor: 'rgba(212, 175, 55, 0.3)'
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      {/* Left firework */}
      <motion.span 
        className="text-2xl"
        role="img"
        aria-label="fireworks"
        animate={{ 
          scale: [1, 1.3, 1],
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        &#127878;
      </motion.span>
      
      {/* Text with subtle glow */}
      <span className="text-sm sm:text-base font-semibold tracking-wide" style={{
        color: '#1e3a8a',
        textShadow: '0 1px 4px rgba(30, 58, 138, 0.3)'
      }}>
        Celebrate 2026 – Exclusive New Year Deals!
      </span>
      
      {/* Right sparkle */}
      <motion.span 
        className="text-2xl"
        role="img"
        aria-label="sparkles"
        animate={{ 
          scale: [1, 1.3, 1],
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        &#10024;
      </motion.span>

      {/* Glow effect behind */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-40"
        style={{
          background: "radial-gradient(ellipse at center, rgba(212, 175, 55, 0.15), transparent 70%)",
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};

export default NewYearGlowBadge;
