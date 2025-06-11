import React, { useState, useEffect, useRef } from "react";

const ShapeCountChallenge = () => {
    const [shapes, setShapes] = useState([]);
    const [falling, setFalling] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [userGuess, setUserGuess] = useState("");
    const [gameStatus, setGameStatus] = useState("");
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [isCompact, setIsCompact] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [showShapes, setShowShapes] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const timerRef = useRef(null);

    const shapeData = [
        { name: "circle", symbol: "●", color: "text-red-500" },
        { name: "square", symbol: "■", color: "text-blue-500" },
        { name: "triangle", symbol: "▲", color: "text-green-500" },
        { name: "diamond", symbol: "♦", color: "text-purple-500" },
        { name: "star", symbol: "★", color: "text-yellow-500" },
        { name: "heart", symbol: "♥", color: "text-pink-500" }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsCompact(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isTimerRunning) {
            timerRef.current = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isTimerRunning]);

    // Function to start the game
    const startGame = () => {
        setFalling(true);
        setGameStatus("");
        setGameStarted(true);
        setShowShapes(false);
        setUserGuess("");
        setTimer(0);
        setIsTimerRunning(true);
        
        // Generate shapes immediately
        const newShapes = generateShapes();
        setShapes(newShapes);
        setCorrectCount(newShapes.length);
        
        // Show shapes immediately with longer viewing time
        setTimeout(() => {
            setShowShapes(true);
            
            // Hide shapes after 8 seconds (doubled the time)
            setTimeout(() => {
                setShowShapes(false);
                setFalling(false);
                setIsTimerRunning(false);
            }, 8000);
        }, 500);
    };

    // Function to generate random shapes with better positioning
    const generateShapes = () => {
        const numShapes = Math.floor(Math.random() * 5) + 3; // between 3 and 7 shapes
        const generatedShapes = [];
        const usedPositions = [];
        
        // Define lanes across the container (to prevent horizontal overlap)
        const laneWidth = 100 / 8; // 8 lanes
        const availableLanes = Array.from({length: 8}, (_, i) => i);
        
        for (let i = 0; i < numShapes; i++) {
            const shape = shapeData[Math.floor(Math.random() * shapeData.length)];
            
            // Pick a random available lane
            if (availableLanes.length === 0) {
                // Reset lanes if we've used them all
                availableLanes.push(...Array.from({length: 8}, (_, i) => i));
            }
            
            const laneIndex = Math.floor(Math.random() * availableLanes.length);
            const lane = availableLanes.splice(laneIndex, 1)[0];
            
            // Position within the lane
            const horizontalPosition = (lane * laneWidth) + (laneWidth / 2) - 2;
            
            // Stagger the fall delay for visual effect
            const fallDelay = i * 0.3;
            
            generatedShapes.push({
                ...shape,
                id: i,
                left: horizontalPosition,
                top: -10, // Start above the container
                delay: fallDelay,
                duration: 2.5 + Math.random() * 1.5 // Vary fall speed
            });
        }
        return generatedShapes;
    };

    // Function to handle user input
    const handleInputChange = (e) => {
        setUserGuess(e.target.value);
    };

    // Function to check user's guess
    const checkAnswer = () => {
        const guess = parseInt(userGuess);
        if (guess === correctCount) {
            setGameStatus("🎉 Correct! Amazing job!");
            setScore(prev => prev + 10);
            setStreak(prev => prev + 1);
        } else {
            setGameStatus(`❌ Not quite! The correct answer was ${correctCount}. Try again!`);
            setStreak(0);
        }
    };

    // Reset game
    const resetGame = () => {
        setShapes([]);
        setFalling(false);
        setCorrectCount(0);
        setUserGuess("");
        setGameStatus("");
        setGameStarted(false);
        setShowShapes(false);
        setTimer(0);
        setIsTimerRunning(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-300/20 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-green-300/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-40 left-20 w-40 h-40 bg-blue-300/20 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-20 right-40 w-28 h-28 bg-pink-300/20 rounded-full animate-bounce" style={{animationDelay: '3s'}}></div>
            </div>

            {/* Floating Icons */}
            <span className="text-6xl fixed top-20 right-10 z-0 animate-bounce" style={{animationDelay: '0.5s'}}>🎯</span>
            <span className="text-5xl fixed bottom-20 left-10 z-0 animate-bounce" style={{animationDelay: '1.5s'}}>🔢</span>
            <span className="text-4xl fixed top-1/3 left-5 z-0 animate-pulse" style={{animationDelay: '2.5s'}}>⭐</span>

            <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-r from-white/90 to-purple-100/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-8 inline-block">
                            <h1 className="text-5xl font-bold text-purple-700 drop-shadow-lg mb-4">
                                🔢 Shape Count Challenge! 🔢
                            </h1>
                            <p className="text-lg text-purple-600 font-semibold">
                                Watch the falling shapes and count them quickly!
                            </p>
                        </div>
                    </div>

                    {/* Score Board */}
                    <div className="flex justify-center gap-4 mb-8">
                        <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                            <div className="text-center">
                                <div className="text-2xl font-bold">🏆 {score}</div>
                                <div className="text-sm">Score</div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                            <div className="text-center">
                                <div className="text-2xl font-bold">🔥 {streak}</div>
                                <div className="text-sm">Streak</div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                            <div className="text-center">
                                <div className="text-2xl font-bold">⏱️ {formatTime(timer)}</div>
                                <div className="text-sm">Time</div>
                            </div>
                        </div>
                    </div>

                    {/* Game Area */}
                    <div className="bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-8 mb-8">
                        {/* Game Container */}
                        <div className="relative mx-auto mb-8" style={{height: '400px', width: '100%', maxWidth: '600px'}}>
                            <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-sky-400 rounded-2xl border-4 border-blue-300 overflow-hidden shadow-inner">
                                {/* Cloud decorations */}
                                <div className="absolute top-4 left-8 text-4xl animate-float opacity-50">☁️</div>
                                <div className="absolute top-12 right-12 text-3xl animate-float opacity-50" style={{animationDelay: '1s'}}>☁️</div>
                                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-5xl animate-float opacity-50" style={{animationDelay: '2s'}}>☁️</div>

                                {/* Falling Shapes */}
                                {showShapes && shapes.map((shape) => (
                                    <div
                                        key={shape.id}
                                        className={`absolute text-7xl ${shape.color} drop-shadow-2xl`}
                                        style={{
                                            left: `${shape.left}%`,
                                            animation: `fall ${shape.duration}s ease-in ${shape.delay}s forwards`,
                                            top: '-80px',
                                            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                                        }}
                                    >
                                        {shape.symbol}
                                    </div>
                                ))}

                                {/* Game Instructions Overlay */}
                                {!gameStarted && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl">
                                        <div className="text-center text-white">
                                            <div className="text-6xl mb-4">🎮</div>
                                            <div className="text-2xl font-bold">Ready to Count?</div>
                                            <div className="text-lg">Click Start to begin!</div>
                                        </div>
                                    </div>
                                )}

                                {/* Countdown during falling */}
                                {falling && showShapes && (
                                    <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-xl shadow-lg animate-pulse">
                                        Count Now! ⏰
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Game Controls */}
                        <div className="flex flex-col items-center gap-6">
                            {!gameStarted && !gameStatus && (
                                <button
                                    onClick={startGame}
                                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-12 py-4 rounded-2xl font-bold text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
                                >
                                    🚀 Start Challenge
                                </button>
                            )}

                            {gameStarted && !falling && !gameStatus && (
                                <div className="flex flex-col items-center gap-4 w-full max-w-md">
                                    <div className="text-center mb-4">
                                        <h3 className="text-2xl font-bold text-blue-700 mb-2">How many shapes did you count?</h3>
                                        <p className="text-gray-600">Enter your answer below:</p>
                                    </div>
                                    <input
                                        type="number"
                                        value={userGuess}
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 border-3 border-blue-300 rounded-2xl text-center text-2xl font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all"
                                        placeholder="Enter number..."
                                        min="0"
                                        max="20"
                                    />
                                    <button
                                        onClick={checkAnswer}
                                        disabled={!userGuess}
                                        className="w-full bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-xl transform hover:scale-105 transition-all duration-300 disabled:transform-none disabled:cursor-not-allowed"
                                    >
                                        ✨ Submit Answer
                                    </button>
                                </div>
                            )}

                            {gameStatus && (
                                <div className="text-center">
                                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-orange-300 rounded-2xl p-6 mb-6">
                                        <p className="text-2xl font-bold text-orange-700 mb-4">{gameStatus}</p>
                                        {streak > 0 && (
                                            <p className="text-lg text-orange-600">🔥 Amazing streak of {streak}!</p>
                                        )}
                                    </div>
                                    <div className="flex gap-4 justify-center">
                                        <button
                                            onClick={startGame}
                                            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl transform hover:scale-105 transition-all duration-300"
                                        >
                                            🎯 Play Again
                                        </button>
                                        <button
                                            onClick={resetGame}
                                            className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl transform hover:scale-105 transition-all duration-300"
                                        >
                                            🔄 Reset Game
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="text-center">
                        <div className="bg-gradient-to-r from-cyan-100/90 to-blue-100/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-6">
                            <h3 className="text-2xl font-bold text-cyan-700 mb-4">🎯 How to Play</h3>
                            <div className="grid md:grid-cols-3 gap-4 text-cyan-600 font-semibold">
                                <div className="flex flex-col items-center space-y-2">
                                    <span className="text-4xl">👀</span>
                                    <span>Watch the shapes fall from the sky</span>
                                </div>
                                <div className="flex flex-col items-center space-y-2">
                                    <span className="text-4xl">🧮</span>
                                    <span>Count them carefully as they fall</span>
                                </div>
                                <div className="flex flex-col items-center space-y-2">
                                    <span className="text-4xl">✅</span>
                                    <span>Enter your count and submit!</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx>{`                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                
                @keyframes fall {
                    0% {
                        transform: translateY(0);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(450px);
                        opacity: 0.3;
                    }
                }
                
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default ShapeCountChallenge;