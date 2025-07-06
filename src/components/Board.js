import React, { useState } from "react";
import { motion } from "framer-motion";
import Node from "./Node";
import LightMode from "./LightMode";
import { CiPlay1 } from "react-icons/ci";

const Board = ({
  gridDimensions,
  startPosition,
  endPosition,
  grid,
  setGrid,
  setStartPosition,
  setEndPosition,
  isDarkMode,
}) => {
  const [dragging, setDragging] = useState(null);

  // Stop dragging when the mouse is released
  const handleMouseUp = () => {
    setDragging(null);
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

  return (
    <motion.div
      className={`grid justify-center items-center h-80vh ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {(() => {
        const rows = [];
        for (let row = 0; row < gridDimensions.rows; row++) {
          const cols = [];
          for (let col = 0; col < gridDimensions.cols; col++) {
            const isStart =
              row === startPosition.row && col === startPosition.col;
            const isEnd = row === endPosition.row && col === endPosition.col;
            const isWall = grid[row][col] === "wall";
            const isVisited = grid[row][col] === "visited";
            const isPath = grid[row][col] === "path";

            let color;
            if (isStart) {
              color = "bg-green-500";
            } else if (isEnd) {
              color = "bg-red-500";
            } else if (isVisited) {
              color = "bg-blue-400";
            } else if (isPath) {
              color = "bg-yellow-400";
            } else if (isWall) {
              color = "bg-gray-500";
            } else {
              color = isDarkMode ? "bg-gray-700" : "bg-white";
            }
            const borderColor = isDarkMode
              ? "border-[rgba(255,255,255,0.02)]"
              : "border-gray-200";

            cols.push(
              <motion.div
                key={`${row}-${col}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: (row + col) * 0.01,
                  ease: "easeOut",
                }}
              >
                <Node
                  className={`w-10 h-10 border ${borderColor} cell ${color} shadow-sm hover:shadow-md transition-shadow duration-200`}
                  data-row={row}
                  data-col={col}
                  isStart={isStart}
                  isEnd={isEnd}
                  isWall={isWall}
                  isVisited={isVisited}
                  isPath={isPath}
                  isDarkMode={isDarkMode}
                  onMouseDown={(e) => {
                    handleMouseDown(
                      e,
                      isStart ? "start" : isEnd ? "end" : "wall"
                    );
                  }}
                />
              </motion.div>
            );
          }
          rows.push(
            <motion.div
              key={row}
              className="flex"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                delay: row * 0.02,
                ease: "easeOut",
              }}
            >
              {cols}
            </motion.div>
          );
        }
        return rows;
      })()}
    </motion.div>
  );
};

export default Board;
