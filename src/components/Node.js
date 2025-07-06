import React from "react";
import { motion } from "framer-motion";

const Node = ({
  className,
  onMouseDown,
  isStart,
  isEnd,
  isWall,
  isVisited,
  isPath,
  isDarkMode,
  ...props
}) => {
  // Animation variants for different states
  const variants = {
    initial: {
      scale: 0.8,
      opacity: 0.6,
      rotate: 0,
    },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    visited: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 1, 0.8],
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
    path: {
      scale: [1, 1.3, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
    wall: {
      scale: [1, 1.1, 1],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
    start: {
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 1,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
    end: {
      scale: [1, 1.15, 1],
      rotate: [0, -10, 10, 0],
      transition: {
        duration: 1.2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  // Determine the current animation state
  let currentVariant = "animate";
  if (isStart) currentVariant = "start";
  else if (isEnd) currentVariant = "end";
  else if (isWall) currentVariant = "wall";
  else if (isPath) currentVariant = "path";
  else if (isVisited) currentVariant = "visited";

  return (
    <motion.div
      {...props}
      className={`relative ${className}`}
      onMouseDown={onMouseDown}
      variants={variants}
      initial="initial"
      animate={currentVariant}
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.95,
        transition: { duration: 0.1 },
      }}
    >
      {/* Particle effects for visited nodes */}
      {isVisited && (
        <motion.div
          className="absolute inset-0 rounded-sm"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
            transition: { duration: 0.8, ease: "easeOut" },
          }}
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%)",
          }}
        />
      )}

      {/* Glow effect for path nodes */}
      {isPath && (
        <motion.div
          className="absolute inset-0 rounded-sm"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.6, 0.3],
            transition: { duration: 1, ease: "easeInOut" },
          }}
          style={{
            background:
              "radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, transparent 70%)",
            filter: "blur(2px)",
          }}
        />
      )}

      {/* Pulse effect for start/end nodes */}
      {(isStart || isEnd) && (
        <motion.div
          className="absolute inset-0 rounded-sm"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0, 0.3],
            transition: {
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
            },
          }}
          style={{
            background: isStart
              ? "radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, transparent 70%)",
          }}
        />
      )}
    </motion.div>
  );
};

export default Node;
