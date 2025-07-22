import React from 'react';

const BodyIcon = ({ className = "w-full h-32 object-cover" }) => {
  return (
    <div className={`${className} bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center`}>
      <svg 
        viewBox="0 0 100 200" 
        className="w-20 h-40 text-blue-600"
      >
        {/* Head */}
        <circle
          cx="50"
          cy="25"
          r="15"
          fill="currentColor"
          opacity="0.8"
        />
        
        {/* Eyes */}
        <circle cx="45" cy="22" r="2" fill="white" />
        <circle cx="55" cy="22" r="2" fill="white" />
        
        {/* Nose */}
        <ellipse cx="50" cy="28" rx="2" ry="1" fill="white" opacity="0.7" />
        
        {/* Mouth */}
        <ellipse cx="50" cy="32" rx="4" ry="1.5" fill="white" opacity="0.7" />
        
        {/* Body */}
        <rect x="40" y="40" width="20" height="40" fill="currentColor" opacity="0.8" />
        
        {/* Arms */}
        <rect x="30" y="45" width="10" height="30" fill="currentColor" opacity="0.8" />
        <rect x="60" y="45" width="10" height="30" fill="currentColor" opacity="0.8" />
        
        {/* Legs */}
        <rect x="42" y="80" width="8" height="40" fill="currentColor" opacity="0.8" />
        <rect x="50" y="80" width="8" height="40" fill="currentColor" opacity="0.8" />
        
        {/* Decorative elements */}
        <circle cx="20" cy="60" r="3" fill="currentColor" opacity="0.3" />
        <circle cx="80" cy="60" r="3" fill="currentColor" opacity="0.3" />
        <circle cx="50" cy="130" r="4" fill="currentColor" opacity="0.3" />
      </svg>
    </div>
  );
};

export default BodyIcon; 