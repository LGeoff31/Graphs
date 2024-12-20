import React, { useState, useEffect, useRef } from "react";
import Node from "./Node";
import { FaPlay, FaPause } from "react-icons/fa";
import { bfs } from "../algorithms/bfs";
import { multiBFS } from "../algorithms/multibfs";
import { dfs } from "../algorithms/dfs";

// Add number tiles
const Homepage = () => {
  const rowSize = 30;
  const colSize = 50;

  const [startPosition, setStartPosition] = useState({ row: 2, col: 4 });
  const [endPosition, setEndPosition] = useState({ row: 10, col: 10 });
  const [dragging, setDragging] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bfs");
  const [visitedCount, setVisitedCount] = useState(0);

  const [paused, setPaused] = useState(true);
  const [speed, setSpeed] = useState(50);
  const speedRef = useRef(speed);
  const pausedRef = useRef(paused);

  const [grid, setGrid] = useState(
    Array.from({ length: rowSize }, () => Array(colSize).fill("unvisited"))
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
      Array.from({ length: rowSize }, () => Array(colSize).fill("unvisited"))
    );
    setVisitedCount(0);
    bfsState.current = {
      queue: [],
      visited: new Set(),
      prev: new Map(),
      isComplete: false,
    };
  };

  const handleSpeedChange = () => {
    const speeds = [100, 50, 25];
    const currentIndex = speeds.indexOf(speed);
    setSpeed(speeds[(currentIndex + 1) % speeds.length]);
  };
  const speedDisplay = () => {
    if (speed === 50) {
      return "1x";
    } else if (speed === 100) {
      return "0.5x";
    } else {
      return "2x";
    }
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
    console.log("ran");
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
        rowSize,
        colSize,
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
        rowSize,
        colSize,
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
        rowSize,
        colSize,
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
  // Selecting a start or end node
  const handleMouseDown = (e, type) => {
    const target = e.target;
    const row = parseInt(target.dataset.row);
    const col = parseInt(target.dataset.col);

    if (isNaN(row) || isNaN(col)) return;
    if (type === "start") {
      setDragging("start");
      setStartPosition({ row, col });
    } else if (type === "end") {
      setDragging("end");
      setEndPosition({ row, col });
    } else if (type === "wall") {
      setDragging("wall");
    }

    e.preventDefault();
  };
  // Update start or end node position
  const handleMouseMove = (e) => {
    if (!dragging) return;

    const target = e.target;
    const row = parseInt(target.dataset.row);
    const col = parseInt(target.dataset.col);

    if (isNaN(row) || isNaN(col)) return;

    if (dragging === "start") {
      setStartPosition({ row, col });
    } else if (dragging === "end") {
      setEndPosition({ row, col });
    } else if (dragging === "wall") {
      toggleWall(row, col);
    }
  };

  const toggleWall = (row, col) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((gridRow, rowIndex) =>
        gridRow.map((node, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return node === "wall" ? "unvisited" : "wall";
          }
          return node;
        })
      );
      return newGrid;
    });
  };

  // Stop dragging when the mouse is released
  const handleMouseUp = () => {
    setDragging(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-300 overflow-auto justify-center">
      <div
        className="grid  w-full  items-center justify-center mt-10"
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {(() => {
          const rows = [];
          for (let row = 0; row < rowSize; row++) {
            const cols = [];
            for (let col = 0; col < colSize; col++) {
              const isStart =
                row === startPosition.row && col === startPosition.col;
              const isEnd = row === endPosition.row && col === endPosition.col;
              const isWall = grid[row][col] === "wall";
              const color = isStart
                ? "bg-green-500"
                : isEnd
                ? "bg-red-500"
                : grid[row][col] === "visited"
                ? "bg-blue-400"
                : grid[row][col] === "path"
                ? "bg-yellow-400"
                : isWall
                ? "bg-gray-500"
                : "bg-white";

              cols.push(
                <Node
                  key={`${row}-${col}`}
                  className={`w-6 h-6 border border-grey-400 ${color}`}
                  data-row={row}
                  data-col={col}
                  onMouseDown={(e) => {
                    handleMouseDown(
                      e,
                      isStart ? "start" : isEnd ? "end" : "wall"
                    );
                  }}
                />
              );
            }
            rows.push(
              <div key={row} className="flex">
                {cols}
              </div>
            );
          }
          return rows;
        })()}
      </div>
      <div class="flex items-center justify-center mt-10 gap-4">
        <div className="flex justify-center">
          <select
            id="algorithmSelect"
            value={selectedAlgorithm}
            onChange={handleAlgorithmChange}
            className="p-2 borderb order-gray-300 rounded"
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
          onClick={handleSpeedChange}
          className="h-12 px-6 py-3 text-lg rounded-md bg-green-500 hover:bg-green-600"
        >
          {speedDisplay()}
        </button>
        <button
          onClick={resetBFSState}
          className="h-12 px-6 py-3 text-lg rounded-md bg-green-500 hover:bg-green-600"
        >
          Reset
        </button>
        <p># Visited Cells: {visitedCount}</p>
      </div>
    </div>
  );
};

export default Homepage;
