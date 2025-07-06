import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaPause, FaRocket, FaChartLine } from "react-icons/fa";
import { bfs } from "../algorithms/bfs";
import { multiBFS } from "../algorithms/multibfs";
import { dfs } from "../algorithms/dfs";
import RefreshIcon from "@mui/icons-material/Refresh";
import Hamburger from "./Hamburger";
import Board from "./Board";
import LoadingScreen from "./LoadingScreen";
import { InfoTooltip } from "./Tooltip";
import {
  cellSize,
  speedDisplay,
  handleSpeedChange,
} from "../composables/utilities";
import LightMode from "./LightMode";

// Add number tiles
const Homepage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [gridDimensions, setGridDimensions] = useState({
    rows: Math.floor(window.innerHeight / cellSize),
    cols: Math.floor(window.innerWidth / cellSize),
  });
  const [startPosition, setStartPosition] = useState({
    row: Math.floor(Math.random() * gridDimensions.rows),
    col: Math.floor(Math.random() * gridDimensions.cols),
  });
  const [endPosition, setEndPosition] = useState({
    row: Math.floor(Math.random() * gridDimensions.rows),
    col: Math.floor(Math.random() * gridDimensions.cols),
  });
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bfs");
  const [visitedCount, setVisitedCount] = useState(0);
  const [paused, setPaused] = useState(true);
  const [speed, setSpeed] = useState(50);
  const speedRef = useRef(speed);
  const pausedRef = useRef(paused);

  const [grid, setGrid] = useState(
    Array.from({ length: gridDimensions.rows }, () =>
      Array(gridDimensions.cols).fill("unvisited")
    )
  );
  const gridRef = useRef(grid);

  // Update grid ref whenever grid changes
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  const bfsState = useRef({
    queue: [],
    visited: new Set(),
    prev: new Map(),
    isComplete: false,
  });

  const multiBfsState = useRef({
    queue1: [],
    queue2: [],
    visited1: new Set(),
    visited2: new Set(),
    prev1: new Map(),
    prev2: new Map(),
    isComplete: false,
  });

  const resetBFSState = () => {
    pausedRef.current = true;
    setPaused(true);
    setGrid(
      Array.from({ length: gridDimensions.rows }, () =>
        Array(gridDimensions.cols).fill("unvisited")
      )
    );
    setVisitedCount(0);
    bfsState.current = {
      queue: [],
      visited: new Set(),
      prev: new Map(),
      isComplete: false,
    };
    multiBfsState.current = {
      queue1: [],
      queue2: [],
      visited1: new Set(),
      visited2: new Set(),
      prev1: new Map(),
      prev2: new Map(),
      isComplete: false,
    };
  };

  // Adjust speed
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  // Pause animation
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);
  // Play animation
  useEffect(() => {
    if (!paused) {
      runAlgorithm();
    }
  }, [paused]);

  const handleAlgorithmChange = (event) => {
    setSelectedAlgorithm(event.target.value);
  };
  const runAlgorithm = () => {
    if (selectedAlgorithm === "bfs") {
      bfs(
        startPosition,
        endPosition,
        gridDimensions.rows,
        gridDimensions.cols,
        grid,
        setGrid,
        speedRef,
        pausedRef,
        () => {
          setPaused(true);
        },
        bfsState.current,
        setVisitedCount,
        () => gridRef.current // Pass grid getter function
      );
    } else if (selectedAlgorithm === "multiBFS") {
      multiBFS(
        startPosition,
        endPosition,
        gridDimensions.rows,
        gridDimensions.cols,
        grid,
        setGrid,
        speedRef,
        pausedRef,
        () => {
          setPaused(true);
        },
        multiBfsState.current,
        setVisitedCount,
        () => gridRef.current // Pass grid getter function
      );
    } else if (selectedAlgorithm === "dfs") {
      dfs(
        startPosition,
        endPosition,
        gridDimensions.rows,
        gridDimensions.cols,
        grid,
        setGrid,
        speedRef,
        pausedRef,
        () => {
          setPaused(true);
        },
        bfsState.current, // Add dfsState as an empty state for now
        setVisitedCount,
        () => gridRef.current // Pass grid getter function
      );
    }
  };

  // Particle effect component
  const ParticleEffect = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <motion.div
      className={`min-h-screen relative overflow-hidden ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <ParticleEffect />

      <Board
        gridDimensions={gridDimensions}
        startPosition={startPosition}
        endPosition={endPosition}
        grid={grid}
        setStartPosition={setStartPosition}
        setEndPosition={setEndPosition}
        setGrid={setGrid}
        isDarkMode={isDarkMode}
      />

      {/* Top Controls */}
      <motion.div
        className="absolute top-5 left-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <LightMode setIsDarkMode={setIsDarkMode} isDarkMode={isDarkMode} />
      </motion.div>

      {/* Algorithm Info Panel */}
      <motion.div
        className={`absolute top-5 right-5 p-6 rounded-2xl backdrop-blur-md border ${
          isDarkMode
            ? "bg-black/20 border-white/10 text-white"
            : "bg-white/20 border-gray-200/50 text-gray-800"
        } shadow-xl`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <FaChartLine className="text-2xl text-blue-400" />
          <h3 className="text-lg font-bold">Algorithm Stats</h3>
          <InfoTooltip content="Real-time statistics about the current algorithm execution" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm opacity-80">Algorithm:</span>
            <span className="font-semibold capitalize">
              {selectedAlgorithm}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm opacity-80">Speed:</span>
            <span className="font-semibold">{speedDisplay(speed)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm opacity-80">Status:</span>
            <span
              className={`font-semibold ${
                paused ? "text-yellow-400" : "text-green-400"
              }`}
            >
              {paused ? "Paused" : "Running"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-80">Nodes Visited:</span>
            <motion.span
              className="text-lg font-bold text-blue-400"
              key={visitedCount}
              initial={{ scale: 1.2, color: "#fbbf24" }}
              animate={{ scale: 1, color: "#60a5fa" }}
              transition={{ duration: 0.3 }}
            >
              {visitedCount}
            </motion.span>
          </div>
        </div>
      </motion.div>

      {/* Bottom Controls */}
      <motion.div
        className="absolute bottom-6 left-0 right-0 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div
          className={`flex gap-4 items-center p-4 rounded-2xl backdrop-blur-md border ${
            isDarkMode
              ? "bg-black/20 border-white/10"
              : "bg-white/20 border-gray-200/50"
          } shadow-xl`}
        >
          {/* Algorithm Selector */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <select
              id="algorithmSelect"
              value={selectedAlgorithm}
              onChange={handleAlgorithmChange}
              className={`p-3 pr-10 border rounded-xl bg-white/10 backdrop-blur-md text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                isDarkMode ? "border-white/20" : "border-gray-300"
              }`}
            >
              <option value="bfs">Breadth-First Search</option>
              <option value="multiBFS">Multi-Source BFS</option>
              <option value="dfs">Depth-First Search</option>
            </select>
            <FaRocket className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
          </motion.div>

          {/* Play/Pause Button */}
          <motion.button
            onClick={() => setPaused((prev) => !prev)}
            className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl shadow-lg transition-all duration-200 ${
              paused
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {paused ? (
                <motion.div
                  key="play"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaPlay />
                </motion.div>
              ) : (
                <motion.div
                  key="pause"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaPause />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Speed Button */}
          <motion.button
            onClick={() => handleSpeedChange(setSpeed, speed)}
            className={`h-12 px-6 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg transition-all duration-200`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {speedDisplay(speed)}
          </motion.button>

          {/* Reset Button */}
          <motion.button
            onClick={resetBFSState}
            className={`h-12 w-12 rounded-xl bg-purple-500 hover:bg-purple-600 text-white shadow-lg transition-all duration-200`}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
          >
            <RefreshIcon />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Homepage;
