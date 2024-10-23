import React from 'react'

const Test = () => {
  return (

    <div className="relative inline-block">
      <div className="absolute inset-0 bg-black transform translate-x-2 translate-y-2"></div>
      <button className="relative bg-white text-black px-6 py-3 border border-black font-semibold flex items-center space-x-2">
        
        <span>READ MORE</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};




export default Test
