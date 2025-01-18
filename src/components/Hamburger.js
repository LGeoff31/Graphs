import React, { useState } from "react";

const Hamburger = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 px-6 py-3 rounded-md bg-green-500 hover:bg-green-600 flex flex-col justify-center items-center space-y-1.5 transition-all duration-300 ease-in-out"
      >
        <div
          className={`w-8 h-1 bg-white transition-transform duration-300 ease-in-out ${
            isOpen ? "transform rotate-45 translate-y-2" : ""
          }`}
        ></div>
        <div
          className={`w-8 h-1 bg-white transition-opacity duration-300 ease-in-out ${
            isOpen ? "opacity-0" : ""
          }`}
        ></div>
        <div
          className={`w-8 h-1 bg-white transition-transform duration-300 ease-in-out ${
            isOpen ? "transform -rotate-45 -translate-y-2" : ""
          }`}
        ></div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="flex flex-col gap-3 absolute top-14 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-4 w-48">
          <button className="py-2 px-4 text-left text-gray-700 hover:bg-gray-100 rounded transition-all duration-200">
            Button 1
          </button>
          <button className="py-2 px-4 text-left text-gray-700 hover:bg-gray-100 rounded transition-all duration-200">
            Button 2
          </button>
          <button className="py-2 px-4 text-left text-gray-700 hover:bg-gray-100 rounded transition-all duration-200">
            Button 3
          </button>
        </div>
      )}
    </div>
  );
};

export default Hamburger;
