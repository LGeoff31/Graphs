export const bfs = async (
  startPosition,
  endPosition,
  rowSize,
  colSize,
  grid,
  setGrid,
  speedRef,
  pausedRef,
  onComplete,
  bfsState,
  setVisitedCount
) => {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, 1],
    [0, -1],
  ];
  if (bfsState.queue.length === 0 && bfsState.visited.size === 0) {
    bfsState.queue.push(startPosition);
    bfsState.visited.add(`${startPosition.row}-${startPosition.col}`);
  }

  while (bfsState.queue.length > 0 && !bfsState.isComplete) {
    if (pausedRef.current) return;

    const { row, col } = bfsState.queue.shift();

    await new Promise((resolve) => setTimeout(resolve, speedRef.current));

    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[row][col] = "visited";
      setVisitedCount((prev) => prev + 1);
      return newGrid;
    });

    if (row === endPosition.row && col === endPosition.col) {
      let current = `${row}-${col}`;
      while (current) {
        if (pausedRef.current) return;
        const [curRow, curCol] = current.split("-").map(Number);
        setGrid((prevGrid) => {
          const newGrid = [...prevGrid];
          newGrid[curRow][curCol] = "path";
          return newGrid;
        });
        current = bfsState.prev.get(current);
        await new Promise((resolve) => setTimeout(resolve, speedRef.current));
      }
      bfsState.isComplete = true;
      onComplete();
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
        !bfsState.visited.has(key) &&
        grid[newRow][newCol] !== "wall"
      ) {
        bfsState.visited.add(key);
        bfsState.queue.push({ row: newRow, col: newCol });
        bfsState.prev.set(key, `${row}-${col}`);
      }
    }
  }
};
