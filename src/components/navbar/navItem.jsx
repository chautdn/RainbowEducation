import React from "react";
import { useNavigate } from "react-router-dom";

const NavItem = ({ icon, label, active, path, isCompact }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer transition-all duration-500 flex flex-col items-center justify-center hover:scale-110 transform
        ${isCompact ? "w-16 h-16 rounded-full mx-2 flex-shrink-0 border-2" : "px-6 py-3 rounded-full border-2"}
        ${active 
          ? (isCompact 
            ? "bg-gradient-to-r from-yellow-300 to-orange-400 border-white text-white shadow-2xl" 
            : "bg-gradient-to-r from-yellow-300 to-orange-400 text-white font-bold shadow-2xl border-white") 
          : (isCompact 
            ? "bg-gradient-to-r from-purple-500 to-pink-500 border-white/50 text-white hover:from-purple-400 hover:to-pink-400" 
            : "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-white/50 hover:from-purple-400 hover:to-pink-400")}
      `}
      style={isCompact && active ? { 
        boxShadow: '0 0 20px rgba(251, 191, 36, 0.6), 0 0 40px rgba(251, 191, 36, 0.3)' 
      } : isCompact ? {
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
      } : active ? {
        boxShadow: '0 8px 25px rgba(251, 191, 36, 0.4), 0 4px 15px rgba(0, 0, 0, 0.2)'
      } : {
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
      }}
    >
      <div className={`flex items-center justify-center w-full h-full ${isCompact ? "text-2xl" : "text-xl"}`}>
        <span className="drop-shadow-lg">{icon}</span>
      </div>
      {!isCompact && (
        <span className="text-sm mt-1 font-semibold drop-shadow-sm">
          {label}
        </span>
      )}
    </div>
  );
};

export default NavItem;