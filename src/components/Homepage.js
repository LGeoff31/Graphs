import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { bfs } from "../algorithms/bfs";
import { multiBFS } from "../algorithms/multibfs";
import { dfs } from "../algorithms/dfs";
import RefreshIcon from "@mui/icons-material/Refresh";
import Hamburger from "./Hamburger";
import Board from "./Board";
import {
  cellSize,
  speedDisplay,
  handleSpeedChange,
} from "../composables/utilities";
import LightMode from "./LightMode";

// Add number tiles
const Homepage = () => {
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
        setVisitedCount
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
        setVisitedCount
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
        setVisitedCount
      );
    }
  };
  return (
    <div className="bg-gray-300 h-screen justify-center items-center flex">
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
      <div className="absolute top-5 left-5 p-2 ">
        <LightMode setIsDarkMode={setIsDarkMode} isDarkMode={isDarkMode} />
      </div>
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 items-center">
        <div className="flex justify-center bg-blue-500 rounded-md text-white shadow-lg">
          <select
            id="algorithmSelect"
            value={selectedAlgorithm}
            onChange={handleAlgorithmChange}
            className="p-3 border border-gray-300 rounded-md bg-white text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-50 transition-colors duration-200"
          >
            <option value="bfs"> BFS </option>
            <option value="multiBFS"> Multi-Source BFS </option>
            <option value="dfs"> DFS</option>
          </select>
        </div>
        <button
          onClick={() => setPaused((prev) => !prev)}
          className="h-12 px-6 py-3 text-lg rounded-md bg-green-500 hover:bg-green-600"
        >
          {paused ? <FaPlay /> : <FaPause />}
        </button>
        <button
          onClick={() => handleSpeedChange(setSpeed, speed)}
          className="h-12 px-6 py-3 text-lg rounded-md bg-green-500 hover:bg-green-600"
        >
          {speedDisplay(speed)}
        </button>
        <button
          onClick={resetBFSState}
          className="h-12 px-6 py-3 rounded-md bg-green-500 hover:bg-green-600"
        >
          <RefreshIcon />
        </button>
      </div>
      <div className="absolute top-6 right-6 transform -translate-x-1/2 flex gap-4 items-center">
        <p className="text-lg font-bold text-white bg-blue-500 px-6 py-2 rounded shadow">
          {visitedCount}
        </p>
      </div>
    </div>
  );
};

export default Homepage;
