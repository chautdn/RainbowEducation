import React, { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import SpeechUtils from "../../../utils/SpeechUtils";

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

// Function to generate random images based on fruit name and count
const generateRandomImages = (fruitName, maxCount) => {
    const emojis = {
        Apple: "🍎",
        Banana: "🍌", 
        Grape: "🍇",
        Orange: "🍊",
        Pineapple: "🍍",
        Strawberry: "🍓",
        Watermelon: "🍉",
        Lemon: "🍋",
        Cherry: "🍒",
        Peach: "🍑",
        Pear: "🍐",
        Mango: "🥭",
        Blueberry: "🫐",
        Kiwi: "🥝",
        Coconut: "🥥",
        Avocado: "🥑"
    };

    const selectedEmoji = emojis[fruitName] || "🍏";
    const randomCount = Math.floor(Math.random() * Math.min(maxCount, 8)) + 1; // 1-8 fruits max
    
    // Generate positioned fruits to avoid overlap
    const positions = [];
    for (let i = 0; i < randomCount; i++) {
        let position;
        let attempts = 0;
        do {
            position = {
                left: Math.random() * 70 + 10, // 10% to 80%
                top: Math.random() * 60 + 10   // 10% to 70%
            };
            attempts++;
        } while (
            attempts < 30 && 
            positions.some(pos => 
                Math.abs(pos.left - position.left) < 20 && 
                Math.abs(pos.top - position.top) < 25
            )
        );
        positions.push(position);
    }
    
    return {
        images: Array.from({ length: randomCount }, (_, index) => ({
            emoji: selectedEmoji,
            id: index,
            position: positions[index] || { left: (index * 15) % 80 + 10, top: 30 }
        })),
        actualCount: randomCount
    };
};

const fruitsData = [
    { name: "Apple", count: 8 },
    { name: "Banana", count: 8 },
    { name: "Grape", count: 8 },
    { name: "Orange", count: 8 },
    { name: "Strawberry", count: 8 },
    { name: "Watermelon", count: 8 }
];

const FruitsCountChallenge = () => {
    const [selectedCounts, setSelectedCounts] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [fruitsWithImages, setFruitsWithImages] = useState([]);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const timerRef = useRef(null);

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

    // Function to start/reset the game
    const startGame = () => {
        setSelectedCounts({});
        setShowResult(false);
        setGameStarted(true);
        setTimer(0);
        setIsTimerRunning(true);
        
        const updatedFruits = fruitsData.map(fruit => {
            const { images, actualCount } = generateRandomImages(fruit.name, fruit.count);
            return { ...fruit, images, actualCount };
        });
        setFruitsWithImages(updatedFruits);
        SpeechUtils.speak("Count all the fruits! Take your time.");
    };

    // Reset everything
    const resetGame = () => {
        setSelectedCounts({});
        setShowResult(false);
        setGameStarted(false);
        setScore(0);
        setStreak(0);
        setTimer(0);
        setIsTimerRunning(false);
        setFruitsWithImages([]);
        SpeechUtils.stop();
    };

    // Update selected count for a fruit
    const handleSelectCount = (fruitName, count) => {
        setSelectedCounts((prev) => ({ ...prev, [fruitName]: count }));
        SpeechUtils.speak(count);
    };

    // Check results and show feedback
    const checkResults = () => {
        setIsTimerRunning(false);
        setShowResult(true);
        
        let correctAnswers = 0;
        fruitsWithImages.forEach(fruit => {
            if (selectedCounts[fruit.name] === fruit.actualCount) {
                correctAnswers++;
            }
        });
        
        const newScore = correctAnswers * 10;
        setScore(prev => prev + newScore);
        
        if (correctAnswers === fruitsWithImages.length) {
            setStreak(prev => prev + 1);
            SpeechUtils.speak("Perfect! All correct!");
        } else {
            setStreak(0);
            SpeechUtils.speak(`You got ${correctAnswers} out of ${fruitsWithImages.length} correct.`);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const allSelected = fruitsWithImages.length > 0 && 
                      fruitsWithImages.every(fruit => selectedCounts[fruit.name] !== undefined);

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-green-200 via-yellow-100 to-orange-200 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-red-300/20 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-300/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-40 left-20 w-40 h-40 bg-green-300/20 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-20 right-40 w-28 h-28 bg-orange-300/20 rounded-full animate-bounce" style={{animationDelay: '3s'}}></div>
            </div>

            {/* Floating Fruit Icons */}
            <span className="text-6xl fixed top-20 right-10 z-0 animate-bounce" style={{animationDelay: '0.5s'}}>🍎</span>
            <span className="text-5xl fixed bottom-20 left-10 z-0 animate-bounce" style={{animationDelay: '1.5s'}}>🍌</span>
            <span className="text-4xl fixed top-1/3 left-5 z-0 animate-pulse" style={{animationDelay: '2.5s'}}>🍇</span>
            <span className="text-6xl fixed bottom-1/3 right-10 z-0 animate-bounce" style={{animationDelay: '3.5s'}}>🍓</span>

            <main className="relative z-10 min-h-screen p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-r from-white/90 to-orange-100/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-8 inline-block">
                            <h1 className="text-5xl font-bold text-orange-600 drop-shadow-lg mb-4 animate-bounce">
                                🍏 Fruit Count Challenge! 🍌
                            </h1>
                            <p className="text-lg text-orange-500 font-semibold">
                                Count the fruits in each box and select the correct number!
                            </p>
                        </div>
                    </div>

                    {/* Score Board */}
                    {gameStarted && (
                        <div className="flex justify-center gap-4 mb-8">
                            <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">🏆 {score}</div>
                                    <div className="text-sm">Score</div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">🔥 {streak}</div>
                                    <div className="text-sm">Perfect Rounds</div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">⏱️ {formatTime(timer)}</div>
                                    <div className="text-sm">Time</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Game Content */}
                    <div className="bg-gradient-to-br from-white/95 to-green-50/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-8">
                        {!gameStarted ? (
                            // Start Screen
                            <div className="text-center py-16">
                                <div className="text-8xl mb-8">🍎🍌🍇🍊</div>
                                <h2 className="text-4xl font-bold text-green-700 mb-6">Ready to Count Fruits?</h2>
                                <p className="text-xl text-green-600 mb-8">Look at each fruit box and count how many fruits you see!</p>
                                <button
                                    onClick={startGame}
                                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-12 py-4 rounded-2xl font-bold text-2xl shadow-xl transform hover:scale-105 transition-all duration-300"
                                >
                                    🚀 Start Counting!
                                </button>
                            </div>
                        ) : (
                            // Game Grid
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    {fruitsWithImages.map((fruit) => (
                                        <div key={fruit.name} className="group">
                                            <div className="bg-gradient-to-br from-white to-yellow-50 border-4 border-pink-300 hover:border-pink-400 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-h-[350px] flex flex-col">
                                                
                                                {/* Fruit Display Area */}
                                                <div className="relative bg-gradient-to-br from-sky-100 to-blue-200 rounded-xl p-4 mb-4 min-h-[180px] border-2 border-blue-300 overflow-hidden">
                                                    {fruit.images.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="absolute text-5xl drop-shadow-lg transition-transform duration-300 hover:scale-110"
                                                            style={{
                                                                left: `${item.position.left}%`,
                                                                top: `${item.position.top}%`,
                                                                transform: 'translate(-50%, -50%)'
                                                            }}
                                                        >
                                                            {item.emoji}
                                                        </div>
                                                    ))}
                                                    
                                                    {/* Decorative clouds */}
                                                    <div className="absolute top-2 right-2 text-2xl opacity-60">☁️</div>
                                                    <div className="absolute bottom-2 left-2 text-xl opacity-40">☁️</div>
                                                </div>

                                                {/* Fruit Title */}
                                                <h2 className="text-2xl font-bold text-purple-600 text-center mb-4">
                                                    Count the {fruit.name}s
                                                </h2>

                                                {/* Number Selection */}
                                                <div className="flex-1 flex flex-col justify-end">
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {Array.from({ length: 8 }, (_, index) => index + 1).map((number) => (
                                                            <button
                                                                key={number}
                                                                className={`aspect-square rounded-xl text-lg font-bold border-2 transition-all duration-300 transform hover:scale-110 ${
                                                                    selectedCounts[fruit.name] === number
                                                                        ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white border-blue-600 shadow-lg scale-105"
                                                                        : "bg-gradient-to-r from-yellow-200 to-orange-200 hover:from-yellow-300 hover:to-orange-300 text-gray-700 border-yellow-400"
                                                                }`}
                                                                onClick={() => handleSelectCount(fruit.name, number)}
                                                            >
                                                                {number}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 items-center justify-center">
                                    <button
                                        onClick={checkResults}
                                        disabled={!allSelected}
                                        className={`px-8 py-4 rounded-2xl text-xl font-bold shadow-xl transform transition-all duration-300 ${
                                            allSelected
                                                ? "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white hover:scale-105"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                    >
                                        {allSelected ? "🎯 Check Results!" : "📝 Select all counts first"}
                                    </button>
                                    
                                    <button
                                        onClick={startGame}
                                        className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-6 py-4 rounded-2xl font-bold shadow-xl transform hover:scale-105 transition-all duration-300"
                                    >
                                        🔄 New Game
                                    </button>

                                    <button 
                                        onClick={() => window.history.back()}
                                        className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-6 py-4 rounded-2xl font-bold shadow-xl transform hover:scale-105 transition-all duration-300"
                                    >
                                        🔙 Go Back
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Instructions */}
                    {gameStarted && (
                        <div className="text-center mt-8">
                            <div className="bg-gradient-to-r from-cyan-100/90 to-blue-100/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-6">
                                <h3 className="text-2xl font-bold text-cyan-700 mb-4">🎯 How to Play</h3>
                                <div className="grid md:grid-cols-3 gap-4 text-cyan-600 font-semibold">
                                    <div className="flex flex-col items-center space-y-2">
                                        <span className="text-4xl">👀</span>
                                        <span>Look carefully at each fruit box</span>
                                    </div>
                                    <div className="flex flex-col items-center space-y-2">
                                        <span className="text-4xl">🧮</span>
                                        <span>Count all the fruits you see</span>
                                    </div>
                                    <div className="flex flex-col items-center space-y-2">
                                        <span className="text-4xl">✅</span>
                                        <span>Click the correct number for each box</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Results Modal */}
            {showResult && (
                <div className="fixed inset-0 bg-blue-500/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-r from-white to-yellow-100 p-8 rounded-3xl text-center shadow-2xl border-4 border-yellow-400 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="text-6xl mb-6">🎉</div>
                        <h2 className="text-4xl font-bold text-orange-600 mb-6">Your Results!</h2>
                        
                        <div className="space-y-4 mb-8">
                            {fruitsWithImages.map((fruit) => {
                                const isCorrect = selectedCounts[fruit.name] === fruit.actualCount;
                                return (
                                    <div key={fruit.name} className={`p-4 rounded-2xl border-2 ${
                                        isCorrect 
                                            ? "bg-green-100 border-green-400 text-green-700" 
                                            : "bg-red-100 border-red-400 text-red-700"
                                    }`}>
                                        <div className="flex items-center justify-between">
                                            <span className="text-3xl">{fruit.images[0]?.emoji}</span>
                                            <div className="text-center">
                                                <div className="font-bold text-lg">{fruit.name}</div>
                                                <div className="text-sm">
                                                    Your answer: {selectedCounts[fruit.name] || "Not selected"}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className={`text-2xl ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                                                    {isCorrect ? "✅" : "❌"}
                                                </div>
                                                {!isCorrect && (
                                                    <div className="text-sm">Correct: {fruit.actualCount}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={startGame}
                                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                                🎮 Play Again
                            </button>
                            <button
                                onClick={resetGame}
                                className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                                🏠 Main Menu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FruitsCountChallenge;