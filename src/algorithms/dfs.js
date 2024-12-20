export const dfs = async (
  startPosition,
  endPosition,
  rowSize,
  colSize,
  grid,
  setGrid,
  speedRef,
  pausedRef,
  onComplete,
  dfsState,
  setVisitedCount
) => {
  if (dfsState.visited.size === 0) {
    dfsState.visited.add(`${startPosition.row}-${startPosition.col}`);
    dfsState.queue.push(startPosition);
  }

  const explore = async (row, col) => {
    if (pausedRef.current) return;

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
        current = dfsState.prev.get(current);
        await new Promise((resolve) => setTimeout(resolve, speedRef.current));
      }
      dfsState.isComplete = true;
      onComplete();
      return;
    }

    const neighbors = [
      { row: row - 1, col: col },
      { row: row + 1, col: col },
      { row: row, col: col + 1 },
      { row: row, col: col - 1 },
    ];

    for (const { row: newRow, col: newCol } of neighbors) {
      const key = `${newRow}-${newCol}`;
      if (
        0 <= newRow &&
        newRow < rowSize &&
        0 <= newCol &&
        newCol < colSize &&
        !dfsState.visited.has(key) &&
        grid[newRow][newCol] !== "wall"
      ) {
        dfsState.visited.add(key);
        dfsState.prev.set(key, `${row}-${col}`);
        await explore(newRow, newCol);
        if (dfsState.isComplete) return;
      }
    }
  };

  const { row, col } = startPosition;
  await explore(row, col);
};
