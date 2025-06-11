import React, { useState, useEffect } from 'react';
import { gameLessons } from '../../utils/gameLessons';
import GameLessonCard from '../../components/GameLessonCard';
import ShapesAnimation from "../../components/sharedComponents/ShapesAnimation";
import CustomNavbar from '../../components/navbar/CustomNavbar';
import FallingNumbers from '../../components/sharedComponents/FallingNumbers';
import FallingShapes from '../../components/shapes/FallingShapes';

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
        <div className="relative min-h-screen bg-gradient-to-r from-green-200 via-yellow-100 to-blue-200 overflow-hidden">
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
            
            {/* Educational floating icons */}
            <span className="text-6xl fixed top-1/3 left-5 z-0 animate-bounce" style={{animationDelay: '0.5s'}}>
                📚
            </span>
            <span className="text-5xl fixed top-1/2 right-5 z-0 animate-bounce" style={{animationDelay: '1s'}}>
                🎓
            </span>
            <span className="text-6xl fixed bottom-1/3 right-1/4 z-0 animate-bounce" style={{animationDelay: '1.5s'}}>
                ✏️
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
                            {/* Page Title */}
                            <div className="text-center mb-12">
                                <div className="bg-gradient-to-r from-white/80 to-purple-100/80 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-8 inline-block">
                                    <h1 className="text-5xl font-bold text-purple-700 drop-shadow-lg animate-pulse mb-4">
                                        📚 Select Your Lesson! 📚
                                    </h1>
                                    <p className="text-lg text-purple-600 font-semibold">
                                        Choose a fun learning adventure to begin your educational journey!
                                    </p>
                                </div>
                            </div>

                            {/* Game Lessons Grid */}
                            <div className="bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {gameLessons.map((game) => (
                                        <div 
                                            key={game.gameLessonId} 
                                            className="relative group"
                                        >
                                            {/* Lesson Card Container */}
                                            <div className="relative p-6 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 duration-300 border-2 border-blue-200 hover:border-blue-400 overflow-hidden min-h-[400px]">
                                                {/* Animated Background Elements */}
                                                <div className="absolute top-2 right-2 w-16 h-16 bg-gradient-to-br from-pink-200 to-red-200 rounded-full opacity-60 animate-ping group-hover:animate-bounce"></div>
                                                <div className="absolute bottom-2 left-2 w-12 h-12 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-60 animate-spin group-hover:animate-pulse"></div>
                                                
                                                {/* Lesson Image */}
                                                <div className="mb-4 overflow-hidden rounded-xl border-2 border-blue-300">
                                                    <img 
                                                        src={game.imgUrl} 
                                                        alt={`${game.title} lesson`}
                                                        className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                </div>
                                                
                                                {/* GameLessonCard Component */}
                                                <GameLessonCard game={game} />
                                                
                                                {/* Additional animated elements */}
                                                <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-40 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                                                <div className="absolute bottom-4 right-4 w-6 h-6 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-50 animate-bounce" style={{animationDelay: '1s'}}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom Instructions Section */}
                            <div className="text-center mt-12">
                                <div className="bg-gradient-to-r from-green-200/90 to-emerald-200/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-6">
                                    <h3 className="text-2xl font-bold text-green-700 mb-4 drop-shadow-lg">
                                        🎯 How to Get Started
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4 text-green-600 font-semibold">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-3xl">📖</span>
                                            <span>Click "Learn First" to understand the basics</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-3xl">🎮</span>
                                            <span>Then "Play Games" to practice and have fun!</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Background Floating Shapes */}
            <div className="absolute z-0 top-0 left-0 w-32 h-32 bg-pink-300/30 rounded-full animate-bounce" style={{animationDelay: '2.5s'}}></div>
            <div className="absolute z-0 bottom-20 right-10 w-28 h-28 bg-orange-300/40 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
            <div className="absolute z-0 top-1/2 left-1/4 w-20 h-20 bg-cyan-300/30 rounded-full animate-pulse" style={{animationDelay: '3.5s'}}></div>
        </div>
    );
};

export default GameLessons;