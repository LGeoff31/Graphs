import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";

const LightMode = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`p-4 rounded-2xl backdrop-blur-md border shadow-xl transition-all duration-300 ${
          isDarkMode
            ? "bg-black/20 border-white/10 text-yellow-400 hover:bg-black/30"
            : "bg-white/20 border-gray-200/50 text-orange-500 hover:bg-white/30"
        }`}
        whileHover={{
          scale: 1.1,
          rotate: 15,
          boxShadow: isDarkMode
            ? "0 0 30px rgba(251, 191, 36, 0.4)"
            : "0 0 30px rgba(249, 115, 22, 0.4)",
        }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: isDarkMode
            ? [
                "0 0 0 rgba(251, 191, 36, 0.4)",
                "0 0 20px rgba(251, 191, 36, 0.6)",
                "0 0 0 rgba(251, 191, 36, 0.4)",
              ]
            : [
                "0 0 0 rgba(249, 115, 22, 0.4)",
                "0 0 20px rgba(249, 115, 22, 0.6)",
                "0 0 0 rgba(249, 115, 22, 0.4)",
              ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <AnimatePresence mode="wait">
          {isDarkMode ? (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <FaSun className="text-2xl" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <FaMoon className="text-2xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};

export default LightMode;
