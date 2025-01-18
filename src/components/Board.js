import React, { useState } from "react";
import Node from "./Node";

const Board = ({
  gridDimensions,
  startPosition,
  endPosition,
  grid,
  setGrid,
  setStartPosition,
  setEndPosition,
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
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div
      className={`grid justify-center items-center h-80vh ${
        isDarkMode ? "bg-grey-900 text-white" : "bg-white text-black"
      }`}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded"
      >
        Toggle Dark Mode
      </button>
      {(() => {
        const rows = [];
        for (let row = 0; row < gridDimensions.rows; row++) {
          const cols = [];
          for (let col = 0; col < gridDimensions.cols; col++) {
            const isStart =
              row === startPosition.row && col === startPosition.col;
            const isEnd = row === endPosition.row && col === endPosition.col;
            const isWall = grid[row][col] === "wall";
            let color;
            if (isStart) {
              color = "bg-green-500";
            } else if (isEnd) {
              color = "bg-red-500";
            } else if (grid[row][col] === "visited") {
              color = "bg-blue-400";
            } else if (grid[row][col] === "path") {
              color = "bg-yellow-400";
            } else if (isWall) {
              color = "bg-gray-500";
            } else {
              color = isDarkMode ? "bg-gray-700" : "bg-white";
            }
            const borderColor = isDarkMode
              ? "border-[rgba(255,255,255,0.02)]"
              : "border-grey-900";

            cols.push(
              <Node
                key={`${row}-${col}`}
                className={`w-10 h-10 border ${borderColor} cell ${color}`}
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
  );
};

export default Board;
