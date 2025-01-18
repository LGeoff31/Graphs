import React, { useState } from "react";
import { CiLight } from "react-icons/ci";

const LightMode = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <div>
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="bg-gray-800 text-white p-3 rounded-full"
      >
        <CiLight />
      </button>
    </div>
  );
};

export default LightMode;
