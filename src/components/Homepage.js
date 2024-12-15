import React, { useState } from "react";
import Node from "./Node";

const Homepage = () => {
  const rowSize = 20;
  const colSize = 40;

  const startPosition = { row: 5, col: 5 };
  const endPosition = { row: 10, col: 10 };

  const [grid, setGrid] = useState(
    Array.from({ length: rowSize }, () => Array(colSize).fill("unvisited"))
  );

  const bfs = async () => {
    const directions = [
      [-1, 0],
      [1, 0],
      [0, 1],
      [0, -1],
    ];
    const queue = [startPosition];
    const visited = new Set();
    const prev = new Map();

    visited.add(`${startPosition.row}-${startPosition.col}`);

    while (queue.length > 0) {
      const { row, col } = queue.shift();
      await new Promise((resolve) => setTimeout(resolve, 50));
      setGrid((prevGrid) => {
        const newGrid = [...prevGrid]; // makes a copy
        newGrid[row][col] = "visited";
        return newGrid;
      });

      if (row === endPosition.row && col === endPosition.col) {
        let current = `${row}-${col}`;
        while (current) {
          const [curRow, curCol] = current.split("-").map(Number);
          setGrid((prevGrid) => {
            const newGrid = [...prevGrid];
            newGrid[curRow][curCol] = "path";
            return newGrid;
          });
          current = prev.get(current); // gets previous node
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        return;
      }

      for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        const key = `${newRow}-${newCol}`;
        if (
          0 <= newRow &&
          newRow < rowSize &&
          0 <= newCol &&
          newCol < colSize &&
          !visited.has(key)
        ) {
          visited.add(key);
          queue.push({ row: newRow, col: newCol });
          prev.set(key, `${row}-${col}`);
        }
      }
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-300">
      <h1 className="text-3xl font-bold mb-4">Path Visualizer</h1>
      <button onClick={bfs}> Run BFS </button>
      <div className="grid grid-cols-20 gap-0.5">
        {(() => {
          const rows = [];
          for (let row = 0; row < rowSize; row++) {
            const cols = [];
            for (let col = 0; col < colSize; col++) {
              const isStart =
                row === startPosition.row && col === startPosition.col;
              const isEnd = row === endPosition.row && col === endPosition.col;
              const color = isStart
                ? "bg-green-500"
                : isEnd
                ? "bg-red-500"
                : grid[row][col] === "visited"
                ? "bg-blue-400"
                : grid[row][col] === "path"
                ? "bg-yellow-400"
                : "bg-white";
              cols.push(
                <Node
                  key={`${row}-${col}`}
                  className={`w-6 h-6 border border-grey-400 ${color}`}
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
    </div>
  );
};

export default Homepage;
