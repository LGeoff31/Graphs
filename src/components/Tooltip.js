import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaInfoCircle } from "react-icons/fa";

const Tooltip = ({ content, children, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 transform -translate-x-1/2 border-t-gray-800",
    bottom: "bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800",
    left: "left-full top-1/2 transform -translate-y-1/2 border-l-gray-800",
    right: "right-full top-1/2 transform -translate-y-1/2 border-r-gray-800",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute z-50 ${positionClasses[position]}`}
            initial={{
              opacity: 0,
              scale: 0.8,
              y: position === "top" ? 10 : position === "bottom" ? -10 : 0,
              x: position === "left" ? 10 : position === "right" ? -10 : 0,
            }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: position === "top" ? 10 : position === "bottom" ? -10 : 0,
              x: position === "left" ? 10 : position === "right" ? -10 : 0,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-xl max-w-xs whitespace-nowrap">
              {content}
              <div
                className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`}
              ></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Info tooltip component
export const InfoTooltip = ({ content, position = "top" }) => {
  return (
    <Tooltip content={content} position={position}>
      <motion.div
        className="inline-flex items-center justify-center w-5 h-5 text-blue-400 cursor-help"
        whileHover={{ scale: 1.2, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaInfoCircle />
      </motion.div>
    </Tooltip>
  );
};

export default Tooltip;
