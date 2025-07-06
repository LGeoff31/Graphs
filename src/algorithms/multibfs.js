export const multiBFS = async (
  startPosition,
  endPosition,
  rowSize,
  colSize,
  grid,
  setGrid,
  speedRef,
  pausedRef,
  onComplete,
  multiBfsState,
  setVisitedCount,
  getCurrentGrid
) => {
  const directions = [
    [-1, 0], // Up
    [1, 0], // Down
    [0, 1], // Right
    [0, -1], // Left
  ];

  if (multiBfsState.queue1.length === 0) {
    multiBfsState.queue1.push({
      row: startPosition.row,
      col: startPosition.col,
    });
    multiBfsState.visited1.add(`${startPosition.row}-${startPosition.col}`);
  }

  if (multiBfsState.queue2.length === 0) {
    multiBfsState.queue2.push({ row: endPosition.row, col: endPosition.col });
    multiBfsState.visited2.add(`${endPosition.row}-${endPosition.col}`);
  }

  while (
    (multiBfsState.queue1.length > 0 || multiBfsState.queue2.length > 0) &&
    !multiBfsState.isComplete
  ) {
    if (pausedRef.current) return;

    const processQueue = async (queue, visited, otherVisited, prev) => {
      const { row, col } = queue.shift();

      // Update grid visualization
      await new Promise((resolve) => setTimeout(resolve, speedRef.current));
      setGrid((prevGrid) => {
        const newGrid = [...prevGrid];

        newGrid[row][col] = "visited";
        setVisitedCount((prev) => prev + 1);

        return newGrid;
      });

      for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        const key = `${newRow}-${newCol}`;

        if (
          0 <= newRow &&
          newRow < rowSize &&
          0 <= newCol &&
          newCol < colSize &&
          !visited.has(key) &&
          getCurrentGrid()[newRow][newCol] !== "wall"
        ) {
          if (otherVisited.has(key)) {
            // Found the meeting point, mark as complete
            multiBfsState.isComplete = true;
            await reconstructPath(
              `${row}-${col}`,
              key,
              multiBfsState.prev1,
              multiBfsState.prev2,
              setGrid,
              speedRef,
              pausedRef,
              onComplete
            );
            return;
          }
          visited.add(key);
          queue.push({ row: newRow, col: newCol });
          prev.set(key, `${row}-${col}`);
        }
      }
    };

    // Process both queues in alternating order
    if (multiBfsState.queue1.length > 0) {
      await processQueue(
        multiBfsState.queue1,
        multiBfsState.visited1,
        multiBfsState.visited2,
        multiBfsState.prev1
      );
    }
    if (multiBfsState.queue2.length > 0) {
      await processQueue(
        multiBfsState.queue2,
        multiBfsState.visited2,
        multiBfsState.visited1,
        multiBfsState.prev2
      );
    }
  }
};

// Path reconstruction
const reconstructPath = async (
  meetingPoint1,
  meetingPoint2,
  prev1,
  prev2,
  setGrid,
  speedRef,
  pausedRef,
  onComplete
) => {
  // Reconstruct path from meeting point to start of queue1
  let current = meetingPoint1;
  while (current) {
    if (pausedRef.current) return;
    const [row, col] = current.split("-").map(Number);
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[row][col] = "path";
      return newGrid;
    });
    current = prev2.get(current);
    await new Promise((resolve) => setTimeout(resolve, speedRef.current));
  }

  // Reconstruct path from meeting point to start of queue2
  current = meetingPoint2;
  while (current) {
    if (pausedRef.current) return;
    const [row, col] = current.split("-").map(Number);
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[row][col] = "path";
      return newGrid;
    });
    current = prev1.get(current);
    await new Promise((resolve) => setTimeout(resolve, speedRef.current));
  }

  onComplete();
};
