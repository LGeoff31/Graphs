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

  return (
    <div
      className="grid justify-center items-center h-80vh"
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
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
                className={`w-10 h-10 border border-grey-400 cell ${color}`}
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
