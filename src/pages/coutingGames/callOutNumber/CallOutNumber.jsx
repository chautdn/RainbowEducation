import React, { useState, useEffect, useRef } from 'react';

// Mock SpeechUtils for the artifact
const SpeechUtils = {
    speak: (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text.toString());
            utterance.rate = 0.8;
            utterance.pitch = 1.2;
            window.speechSynthesis.speak(utterance);
        }
    },
    stop: () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }
};

const CallOutNumber = () => {
    const [count, setCount] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);
    const [targetNumber, setTargetNumber] = useState(10);
    const [gameMode, setGameMode] = useState('stars'); // stars, hearts, rockets, flowers
    const [hasSpoken, setHasSpoken] = useState(false);
    const [animatingStars, setAnimatingStars] = useState([]);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const celebrationTimeoutRef = useRef(null);

    const gameModes = {
        stars: { emoji: '⭐', color: 'from-yellow-400 to-orange-500', name: 'Stars' },
        hearts: { emoji: '❤️', color: 'from-pink-400 to-red-500', name: 'Hearts' },
        rockets: { emoji: '🚀', color: 'from-blue-400 to-purple-500', name: 'Rockets' },
        flowers: { emoji: '🌸', color: 'from-pink-300 to-purple-400', name: 'Flowers' },
        diamonds: { emoji: '💎', color: 'from-cyan-400 to-blue-500', name: 'Diamonds' },
        balloons: { emoji: '🎈', color: 'from-red-400 to-pink-500', name: 'Balloons' }
    };

    // Speak the current count (but only once per count)
    useEffect(() => {
        if (count > 0 && !hasSpoken) {
            const timeout = setTimeout(() => {
                SpeechUtils.speak(`${count} ${gameModes[gameMode].name}`);
                setHasSpoken(true);
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [count, hasSpoken, gameMode]);

    // Reset hasSpoken when count changes
    useEffect(() => {
        setHasSpoken(false);
    }, [count]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            SpeechUtils.stop();
            if (celebrationTimeoutRef.current) {
                clearTimeout(celebrationTimeoutRef.current);
            }
        };
    }, []);

    const handleClick = () => {
        const newCount = count + 1;
        setCount(newCount);
        
        // Add animation effect
        setAnimatingStars(prev => [...prev, newCount - 1]);
        setTimeout(() => {
            setAnimatingStars(prev => prev.filter(index => index !== newCount - 1));
        }, 600);

        if (newCount === targetNumber) {
            setShowCelebration(true);
            setScore(prev => prev + targetNumber * level);
            SpeechUtils.speak(`Congratulations! You counted to ${targetNumber}! Amazing job!`);
            
            celebrationTimeoutRef.current = setTimeout(() => {
                setShowCelebration(false);
                // Auto advance to next level
                nextLevel();
            }, 4000);
        }
    };

    const resetGame = () => {
        SpeechUtils.stop();
        setCount(0);
        setShowCelebration(false);
        setHasSpoken(false);
        setAnimatingStars([]);
        if (celebrationTimeoutRef.current) {
            clearTimeout(celebrationTimeoutRef.current);
        }
    };

    const nextLevel = () => {
        setLevel(prev => prev + 1);
        setTargetNumber(prev => Math.min(prev + 2, 20)); // Increase target, max 20
        resetGame();
        
        // Cycle through game modes
        const modes = Object.keys(gameModes);
        const currentIndex = modes.indexOf(gameMode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        setGameMode(nextMode);
        
        setTimeout(() => {
            SpeechUtils.speak(`Level ${level + 1}! Count to ${Math.min(targetNumber + 2, 20)} ${gameModes[nextMode].name}!`);
        }, 500);
    };

    const changeGameMode = (mode) => {
        resetGame();
        setGameMode(mode);
        SpeechUtils.speak(`Now counting ${gameModes[mode].name}!`);
    };

    const setCustomTarget = (target) => {
        setTargetNumber(target);
        resetGame();
        SpeechUtils.speak(`Count to ${target}!`);
    };

    const currentMode = gameModes[gameMode];

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-300/20 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-pink-300/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-40 left-20 w-40 h-40 bg-blue-300/20 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-20 right-40 w-28 h-28 bg-purple-300/20 rounded-full animate-bounce" style={{animationDelay: '3s'}}></div>
            </div>

            {/* Floating Numbers */}
            <span className="text-6xl fixed top-20 right-10 z-0 animate-bounce text-purple-400/60" style={{animationDelay: '0.5s'}}>1</span>
            <span className="text-5xl fixed bottom-20 left-10 z-0 animate-bounce text-blue-400/60" style={{animationDelay: '1.5s'}}>2</span>
            <span className="text-4xl fixed top-1/3 left-5 z-0 animate-pulse text-pink-400/60" style={{animationDelay: '2.5s'}}>3</span>
            <span className="text-6xl fixed bottom-1/3 right-10 z-0 animate-bounce text-yellow-400/60" style={{animationDelay: '3.5s'}}>10</span>

            <main className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center p-6">
                <div className="max-w-4xl w-full">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-white/90 to-purple-100/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-8 inline-block">
                            <h1 className="text-5xl font-bold text-purple-600 drop-shadow-lg mb-4">
                                🎉 Let's Count Together! 🎉
                            </h1>
                            <p className="text-xl text-pink-600 font-semibold">
                                Click to add {currentMode.name.toLowerCase()} and count to {targetNumber}!
                            </p>
                        </div>
                    </div>

                    {/* Game Stats */}
                    <div className="flex justify-center gap-4 mb-8">
                        <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                            <div className="text-center">
                                <div className="text-2xl font-bold">🏆 {score}</div>
                                <div className="text-sm">Score</div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                            <div className="text-center">
                                <div className="text-2xl font-bold">📈 {level}</div>
                                <div className="text-sm">Level</div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                            <div className="text-center">
                                <div className="text-2xl font-bold">🎯 {targetNumber}</div>
                                <div className="text-sm">Target</div>
                            </div>
                        </div>
                    </div>

                    {/* Game Mode Selector */}
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-white/50 p-6">
                            <h3 className="text-lg font-bold text-blue-700 mb-4">Choose what to count:</h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                {Object.entries(gameModes).map(([key, mode]) => (
                                    <button
                                        key={key}
                                        onClick={() => changeGameMode(key)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                                            gameMode === key
                                                ? `bg-gradient-to-r ${mode.color} text-white shadow-lg scale-105`
                                                : 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200'
                                        }`}
                                    >
                                        <span className="text-2xl">{mode.emoji}</span>
                                        <span>{mode.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Game Area */}
                    <div className="bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-8 mb-8">
                        {/* Items Display */}
                        <div className="min-h-[200px] flex items-center justify-center mb-8">
                            <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
                                {Array.from({ length: count }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentMode.color} flex items-center justify-center text-3xl shadow-lg transform transition-all duration-500 ${
                                            animatingStars.includes(i) ? 'animate-bounce scale-125' : 'hover:scale-110'
                                        }`}
                                        style={{
                                            animationDelay: `${i * 100}ms`,
                                            transform: animatingStars.includes(i) ? 'scale(1.25)' : undefined
                                        }}
                                    >
                                        {currentMode.emoji}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add Button */}
                        <div className="text-center mb-6">
                            <button
                                onClick={handleClick}
                                disabled={count >= targetNumber}
                                className={`px-12 py-4 rounded-2xl text-2xl font-bold shadow-xl transform transition-all duration-300 ${
                                    count >= targetNumber
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : `bg-gradient-to-r ${currentMode.color} hover:scale-105 text-white hover:shadow-2xl active:scale-95`
                                }`}
                            >
                                {count >= targetNumber 
                                    ? `🎉 Completed!` 
                                    : `Click to Add ${currentMode.emoji}!`
                                }
                            </button>
                        </div>

                        {/* Count Display */}
                        <div className="text-center">
                            <div className={`inline-block bg-gradient-to-r ${currentMode.color} text-white p-6 rounded-2xl shadow-xl`}>
                                <div className="text-4xl font-bold mb-2">{count}</div>
                                <div className="text-xl">{currentMode.name}</div>
                                <div className="text-sm opacity-90">
                                    {count < targetNumber ? `${targetNumber - count} more to go!` : 'Target reached!'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {count > 0 && (
                            <button
                                onClick={resetGame}
                                className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                                🔄 Reset
                            </button>
                        )}
                        
                        {count >= targetNumber && !showCelebration && (
                            <button
                                onClick={nextLevel}
                                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                                🚀 Next Level
                            </button>
                        )}
                    </div>

                    {/* Quick Target Selection */}
                    <div className="bg-gradient-to-r from-white/90 to-yellow-50/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-white/50 p-6">
                        <h3 className="text-lg font-bold text-yellow-700 mb-4">Quick Start - Count to:</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {[5, 10, 15, 20].map(target => (
                                <button
                                    key={target}
                                    onClick={() => setCustomTarget(target)}
                                    className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                                        targetNumber === target
                                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-105'
                                            : 'bg-white hover:bg-yellow-50 text-gray-700 border-2 border-yellow-200'
                                    }`}
                                >
                                    {target}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Celebration Modal */}
            {showCelebration && (
                <div className="fixed inset-0 bg-purple-500/75 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gradient-to-r from-white to-yellow-100 p-8 rounded-3xl text-center shadow-2xl border-4 border-yellow-400 transform animate-bounce">
                        <div className="text-8xl mb-6">🎉</div>
                        <h2 className="text-4xl font-bold text-purple-600 mb-4 animate-pulse">
                            Congratulations!
                        </h2>
                        <p className="text-2xl text-blue-700 mb-4">
                            You counted to {targetNumber} {currentMode.name.toLowerCase()}!
                        </p>
                        <p className="text-lg text-gray-600 mb-6">
                            Amazing job! You earned {targetNumber * level} points!
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={nextLevel}
                                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                                🚀 Next Level
                            </button>
                            <button
                                onClick={resetGame}
                                className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                                🔄 Play Again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default CallOutNumber;