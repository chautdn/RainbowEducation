import React from "react";
import { useState } from "react";

import NavItem from "./navItem";
import {
  FaHome,
  FaBookOpen,
  FaGamepad,
  FaPrint,
  FaUserShield,
  FaStar,
} from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";
import { useLocation } from "react-router-dom";
import ParentsMenu from "./ParentsMenu";

const CustomNavbar = ({ isCompact }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [showParentsMenu, setShowParentsMenu] = useState(false);

  return (
    <div
      className={`text-white flex items-center justify-between transition-all duration-500 ${
        isCompact ? "h-28 py-0" : "h-52 p-6"
      } bg-gradient-to-r from-pink-400 via-purple-500 via-blue-500 to-cyan-400 shadow-2xl border-b-4 border-white/50`}
      style={{
        minHeight: isCompact ? 112 : 208,
        background: isCompact
          ? "linear-gradient(135deg, #ff6b9d, #c44569, #f8b500, #00d2d3, #ff9ff3, #54a0ff)"
          : "linear-gradient(135deg, #ff6b9d, #c44569, #f8b500, #00d2d3, #ff9ff3, #54a0ff, #5f27cd)",
      }}
    >
      {/* Left section */}
      <div
        className={`flex ${
          isCompact
            ? "flex-row items-center space-x-4 pl-8"
            : "flex-col items-start space-y-6 pl-8"
        }`}
      >
        <button
          onClick={() => setShowParentsMenu(true)}
          className={`rounded-full flex items-center justify-center shadow-xl transition-all duration-500 hover:scale-110 border-2 border-white/50 ${
            isCompact
              ? "w-12 h-12 bg-gradient-to-r from-yellow-300 to-orange-400 p-0 text-white"
              : "bg-gradient-to-r from-yellow-300 to-orange-400 hover:from-yellow-400 hover:to-orange-500 px-6 py-3 w-auto h-auto text-white font-bold"
          }`}
        >
          <FaUserShield
            className={
              isCompact ? "text-2xl drop-shadow-lg" : "text-xl drop-shadow-lg"
            }
          />
          {!isCompact && <span className="ml-2 drop-shadow-lg">Phụ huynh</span>}
        </button>
        {isCompact ? (
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 flex items-center justify-center shadow-xl border-2 border-white/50">
            <PiStudentBold className="text-2xl text-white drop-shadow-lg" />
          </div>
        ) : (
          <div className="bg-gradient-to-r from-purple-400/90 to-indigo-500/90 backdrop-blur-sm px-4 py-3 rounded-full flex items-center space-x-3 shadow-xl border-2 border-white/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 flex items-center justify-center shadow-lg border border-white/30">
              <PiStudentBold className="text-xl text-white drop-shadow-sm" />
            </div>
            <span className="text-white font-bold text-lg drop-shadow-lg">
              Cấp độ 0
            </span>
            <FaStar className="text-yellow-300 drop-shadow-lg text-xl" />
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-sm px-3 py-2 rounded-full text-white font-bold shadow-lg border border-white/30">
              1
            </div>
          </div>
        )}
      </div>

      {/* Center section */}
      <div className="flex items-center space-x-8">
        <NavItem
          icon={<FaHome />}
          label={isCompact ? "" : "Trang chủ"}
          active={currentPath === "/home"}
          path="/home"
          isCompact={isCompact}
        />
        <NavItem
          icon={<FaBookOpen />}
          label={isCompact ? "" : "Chương trình học"}
          active={currentPath === "/curriculum"}
          path="/curriculum"
          isCompact={isCompact}
        />
        <NavItem
          icon={<FaGamepad />}
          label={isCompact ? "" : "Khu vực trò chơi"}
          active={currentPath === "/game-lessons"}
          path="/game-lessons"
          isCompact={isCompact}
        />
      </div>

      {/* Right section */}
      <div
        className={`flex flex-col items-end ${
          isCompact ? "space-y-0 pr-8" : "space-y-4 pr-8"
        }`}
      >
        {!isCompact && (
          <div className="flex items-center space-x-3 bg-gradient-to-r from-white/20 to-cyan-200/30 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-white/50 shadow-xl">
            <span className="text-white font-black text-xl drop-shadow-lg">
              Rainbow
            </span>
            <span className="text-yellow-200 font-black text-xl drop-shadow-lg">
              Learn
            </span>
            <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg border border-white/30">
              STARTER
            </span>
          </div>
        )}
        <button
          className={`flex items-center justify-center shadow-xl transition-all duration-500 font-bold hover:scale-110 border-3 border-white/70 ${
            isCompact
              ? "w-40 h-12 bg-gradient-to-r from-lime-300 to-green-400 text-green-800 text-base px-0 py-0"
              : "bg-gradient-to-r from-lime-300 to-green-400 text-green-800 px-8 py-4 hover:from-lime-400 hover:to-green-500"
          } rounded-full`}
        >
          <span className="drop-shadow-sm">
            {isCompact ? "Mở khóa tất cả" : "Mở khóa tất cả"}
          </span>
          <FaUserShield
            className={
              isCompact
                ? "ml-2 text-xl drop-shadow-sm"
                : "ml-3 text-lg drop-shadow-sm"
            }
          />
        </button>
        {!isCompact && (
          <div className="flex items-center space-x-3 bg-gradient-to-r from-cyan-300/30 to-blue-400/30 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-white/50 shadow-xl">
            <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg border border-white/30">
              2
            </span>
            <span className="text-white text-sm font-bold drop-shadow-lg">
              Hoạt động miễn phí còn lại hôm nay!
            </span>
          </div>
        )}
      </div>
      {showParentsMenu && <ParentsMenu onClose={() => setShowParentsMenu(false)} />}
    </div>
  );
};

export default CustomNavbar;
