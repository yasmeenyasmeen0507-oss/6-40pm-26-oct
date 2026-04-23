import { useMemo } from "react";
import { motion } from "framer-motion";

interface ParticleProps {
  style: React.CSSProperties;
  size: "small" | "medium" | "large";
  type: "particle" | "orb" | "sparkle";
}

const Particle = ({ style, size, type }: ParticleProps) => {
  const sizeClasses = {
    small: "w-1 h-1",
    medium: "w-1.5 h-1.5",
    large: "w-2 h-2",
  };

  if (type === "sparkle") {
    return (
      <div
        className={`absolute ${sizeClasses[size]}`}
        style={style}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" style={{ color: '#e6c35c' }}>
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>
    );
  }

  if (type === "orb") {
    return (
      <div
        className={`absolute rounded-full blur-[1px] ${
          size === "large" ? "w-3 h-3" : size === "medium" ? "w-2 h-2" : "w-1.5 h-1.5"
        }`}
        style={{
          ...style,
          background: 'radial-gradient(circle, rgba(230, 195, 92, 0.6), rgba(212, 175, 55, 0.4))'
        }}
      />
    );
  }

  return (
    <div
      className={`absolute rounded-full ${sizeClasses[size]}`}
      style={{
        ...style,
        background: 'radial-gradient(circle, #e6c35c, #d4af37)',
        boxShadow: "0 0 6px rgba(230, 195, 92, 0.6)",
      }}
    />
  );
};

const NewYearParticles = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 8,
      size: (["small", "medium", "large"] as const)[Math.floor(Math.random() * 3)],
      type: (["particle", "particle", "orb", "sparkle"] as const)[Math.floor(Math.random() * 4)],
      opacity: 0.4 + Math.random() * 0.4,
    }));
  }, []);

  const orbs = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: `${10 + Math.random() * 80}%`,
      top: `${20 + Math.random() * 60}%`,
      size: 60 + Math.random() * 100,
      delay: Math.random() * 3,
      duration: 5 + Math.random() * 4,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {/* Floating light orbs in background */}
      {orbs.map((orb) => (
        <motion.div
          key={`orb-${orb.id}`}
          className="absolute rounded-full"
          style={{
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
            background: "radial-gradient(circle at center, rgba(230, 195, 92, 0.12), transparent 70%)",
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Rising golden particles */}
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          size={particle.size}
          type={particle.type}
          style={{
            left: particle.left,
            opacity: particle.opacity,
            animation: `float-up ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
            "--duration": `${particle.duration}s`,
            "--delay": `${particle.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Subtle shimmer overlay */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(230, 195, 92, 0.08) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 8s ease-in-out infinite",
        }}
      />
    </div>
  );
};

export default NewYearParticles;
