import React, { useEffect, useState } from "react";

export const cellSize = 40;

export const speedDisplay = (speed) => {
  if (speed === 50) {
    return "1x";
  } else if (speed === 100) {
    return "0.5x";
  } else if (speed === 25) {
    return "2x";
  } else if (speed === 12) {
    return "4x";
  } else {
    return "1x";
  }
};

export const handleSpeedChange = (setSpeed, speed) => {
  const speeds = [100, 50, 25, 12];
  const currentIndex = speeds.indexOf(speed);
  setSpeed(speeds[(currentIndex + 1) % speeds.length]);
};
