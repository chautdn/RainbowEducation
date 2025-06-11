import React, { useState, useEffect } from "react";
import { gameLessons } from "../../utils/gameLessons";
import GameLessonCard from "../../components/GameLessonCard";
import CustomNavbar from "../../components/navbar/CustomNavbar";
import FallingNumbers from "../../components/sharedComponents/FallingNumbers";
import FallingShapes from "../../components/shapes/FallingShapes";
import ShapesAnimation from "../../components/sharedComponents/ShapesAnimation";

const GameLessons = () => {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsCompact(true);
      } else {
        setIsCompact(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-200 via-yellow-100 to-pink-200">
      {/* Animated Background Elements */}
      <FallingNumbers />
      <FallingShapes />
      <ShapesAnimation />
      
      {/* Orbiting Icons */}
      <span className="text-7xl orbiting-icon2 fixed top-20 right-10 z-0">
        🚀
      </span>
      <span className="text-8xl orbiting-icon fixed bottom-20 left-10 z-0">
        🚀
      </span>
      
      {/* Additional floating game icons */}
      <span className="text-6xl fixed top-1/3 left-5 z-0 animate-bounce" style={{animationDelay: '0.5s'}}>
        🎮
      </span>
      <span className="text-5xl fixed top-1/2 right-5 z-0 animate-bounce" style={{animationDelay: '1s'}}>
        🏆
      </span>
      <span className="text-6xl fixed bottom-1/3 right-1/4 z-0 animate-bounce" style={{animationDelay: '1.5s'}}>
        🎯
      </span>
      <span className="text-5xl fixed top-1/4 left-1/3 z-0 animate-bounce" style={{animationDelay: '2s'}}>
        🌟
      </span>

      <main className="relative z-10">
        <div>
          {/* Navbar Section */}
          <div className="sticky top-0 z-50">
            <CustomNavbar isCompact={isCompact} />
            <div className="w-full h-12 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-b-2xl blur-sm"></div>
          </div>

          {/* Main Content */}
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-6">
              {/* Fun Animated Title */}
              <div className="text-center mb-12">
                <div className="bg-gradient-to-r from-white/80 to-yellow-100/80 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-8 inline-block">
                  <h2 className="text-5xl font-bold text-purple-700 drop-shadow-lg animate-pulse mb-4">
                    🎮 Game Zone 🎮
                  </h2>
                  <h3 className="text-3xl font-bold text-orange-600 drop-shadow-md">
                    Select Your Learning Adventure! 📚
                  </h3>
                  <p className="text-lg text-purple-600 mt-4 font-semibold">
                    Choose a lesson and start your fun learning journey!
                  </p>
                </div>
              </div>

              {/* Game Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {gameLessons.map((game, index) => (
                  <div
                    key={game.gameLessonId}
                    className="relative group"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    {/* Card Container */}
                    <div className="relative p-6 bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 duration-300 border-2 border-white/50 min-h-[320px] flex flex-col">
                      
                      {/* Floating Animated Elements */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full opacity-75 animate-bounce z-10 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      
                      {/* Background Animated Shapes */}
                      <div className="absolute top-2 right-2 w-16 h-16 bg-gradient-to-r from-pink-300/30 to-purple-300/30 rounded-full animate-pulse"></div>
                      <div className="absolute bottom-2 left-2 w-12 h-12 bg-gradient-to-r from-cyan-300/30 to-blue-300/30 rounded-full animate-spin-slow"></div>
                      
                      {/* Game Image */}
                      <div className="relative z-20 mb-4 flex-shrink-0">
                        <div className="overflow-hidden rounded-xl border-2 border-white/70 shadow-lg">
                          <img 
                            src={game.imgUrl} 
                            alt={`${game.title} preview`}
                            className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                      </div>
                      
                      {/* Game Content */}
                      <div className="relative z-20 flex-grow">
                        <GameLessonCard game={game} />
                      </div>
                    </div>

                    {/* Floating corner elements */}
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-400 to-teal-400 rounded-full animate-bounce opacity-75" style={{animationDelay: `${index * 0.2}s`}}></div>
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-ping opacity-75" style={{animationDelay: `${index * 0.3}s`}}></div>
                  </div>
                ))}
              </div>

              {/* Bottom Fun Section */}
              <div className="text-center mt-16 mb-8">
                <div className="bg-gradient-to-r from-green-200/90 to-blue-200/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-8 inline-block">
                  <h3 className="text-2xl font-bold text-green-700 mb-4 drop-shadow-lg">
                    Ready to Play & Learn? 🚀
                  </h3>
                  <p className="text-lg text-blue-600 font-semibold">
                    Pick your favorite game and become a learning champion!
                  </p>
                  <div className="flex justify-center space-x-4 mt-6">
                    <div className="bg-green-300 p-4 rounded-full shadow-xl animate-bounce border-2 border-white">
                      🎯
                    </div>
                    <div className="bg-blue-300 p-4 rounded-full shadow-xl animate-bounce border-2 border-white" style={{animationDelay: '0.3s'}}>
                      🏆
                    </div>
                    <div className="bg-purple-300 p-4 rounded-full shadow-xl animate-bounce border-2 border-white" style={{animationDelay: '0.6s'}}>
                      🌟
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameLessons;