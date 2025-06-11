import React, { useState, useEffect, useRef } from "react";

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

// Enhanced objects with better variety and positioning
const objectCategories = {
    vehicles: [
        { name: "Cars", emoji: "🚗", color: "from-blue-400 to-blue-600" },
        { name: "Buses", emoji: "🚌", color: "from-yellow-400 to-orange-500" },
        { name: "Trains", emoji: "🚂", color: "from-gray-400 to-gray-600" },
        { name: "Airplanes", emoji: "✈️", color: "from-sky-400 to-blue-500" },
    ],
    animals: [
        { name: "Cats", emoji: "🐱", color: "from-orange-400 to-red-500" },
        { name: "Dogs", emoji: "🐶", color: "from-amber-400 to-yellow-500" },
        { name: "Birds", emoji: "🐦", color: "from-blue-400 to-cyan-500" },
        { name: "Fish", emoji: "🐠", color: "from-teal-400 to-blue-500" },
    ],
    objects: [
        { name: "Houses", emoji: "🏠", color: "from-green-400 to-emerald-500" },
        { name: "Stars", emoji: "⭐", color: "from-yellow-400 to-orange-500" },
        { name: "Flowers", emoji: "🌸", color: "from-pink-400 to-purple-500" },
        { name: "Balls", emoji: "⚽", color: "from-green-400 to-blue-500" },
    ]
};

// Fisher-Yates Shuffle function
const shuffleArray = (array) => {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// Generate positioned objects to avoid overlap
const generatePositionedObjects = (emoji, count) => {
    const positions = [];
    for (let i = 0; i < count; i++) {
        let position;
        let attempts = 0;
        do {
            position = {
                left: Math.random() * 70 + 10, // 10% to 80%
                top: Math.random() * 60 + 15   // 15% to 75%
            };
            attempts++;
        } while (
            attempts < 30 && 
            positions.some(pos => 
                Math.abs(pos.left - position.left) < 18 && 
                Math.abs(pos.top - position.top) < 20
            )
        );
        positions.push(position);
    }

    return Array.from({ length: count }, (_, index) => ({
        emoji,
        id: index,
        position: positions[index] || { left: (index * 20) % 70 + 10, top: 30 }
    }));
};

const CountAndMatchGame = () => {
    const [selectedMatches, setSelectedMatches] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [objects, setObjects] = useState([]);
    const [gameCategory, setGameCategory] = useState('vehicles');
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [level, setLevel] = useState(1);
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

    // Generate new game
    const generateNewGame = () => {
        const categoryObjects = objectCategories[gameCategory];
        const selectedObjects = shuffleArray(categoryObjects).slice(0, 3);
        
        const gameObjects = selectedObjects.map((obj) => {
            const count = Math.floor(Math.random() * 5) + 2; // 2-6 objects
            return {
                ...obj,
                count,
                items: generatePositionedObjects(obj.emoji, count)
            };
        });
        
        setObjects(gameObjects);
        setSelectedMatches({});
        setShowResults(false);
    };

    // Start game
    const startGame = () => {
        setGameStarted(true);
        setTimer(0);
        setIsTimerRunning(true);
        generateNewGame();
        SpeechUtils.speak("Count the objects and match them with the correct numbers!");
    };

    // Reset game
    const resetGame = () => {
        setSelectedMatches({});
        setShowResults(false);
        setGameStarted(false);
        setScore(0);
        setStreak(0);
        setLevel(1);
        setTimer(0);
        setIsTimerRunning(false);
        setObjects([]);
        SpeechUtils.stop();
    };

    // Handle match selection
    const handleMatch = (objectName, number) => {
        setSelectedMatches(prev => ({ ...prev, [objectName]: number }));
        SpeechUtils.speak(number.toString());
        setShowResults(false);
    };

    // Check results
    const checkMatches = () => {
        setIsTimerRunning(false);
        setShowResults(true);
        
        let correctCount = 0;
        objects.forEach(object => {
            if (selectedMatches[object.name] === object.count) {
                correctCount++;
            }
        });
        
        const newScore = correctCount * 10 * level;
        setScore(prev => prev + newScore);
        
        if (correctCount === objects.length) {
            setStreak(prev => prev + 1);
            SpeechUtils.speak("Perfect! All correct!");
        } else {
            setStreak(0);
            SpeechUtils.speak(`You got ${correctCount} out of ${objects.length} correct.`);
        }
    };

    // Next level
    const nextLevel = () => {
        setLevel(prev => prev + 1);
        
        // Change category for variety
        const categories = Object.keys(objectCategories);
        const currentIndex = categories.indexOf(gameCategory);
        const nextCategory = categories[(currentIndex + 1) % categories.length];
        setGameCategory(nextCategory);
        
        startGame();
        setTimeout(() => {
            SpeechUtils.speak(`Level ${level + 1}! Now counting ${nextCategory}!`);
        }, 500);
    };

    // Change category
    const changeCategory = (category) => {
        setGameCategory(category);
        if (gameStarted) {
            generateNewGame();
            SpeechUtils.speak(`Now counting ${category}!`);
        }
    };

    // Helper functions
    const isMatchCorrect = (objectName) => {
        const object = objects.find(obj => obj.name === objectName);
        return selectedMatches[objectName] === object.count;
    };

    const allSelected = objects.length > 0 && 
                      objects.every(object => selectedMatches[object.name] !== undefined);

    const allCorrect = objects.length > 0 && 
                      objects.every(object => isMatchCorrect(object.name));

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-blue-200 via-yellow-100 to-pink-200 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-purple-300/20 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-blue-300/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-40 left-20 w-40 h-40 bg-yellow-300/20 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-20 right-40 w-28 h-28 bg-pink-300/20 rounded-full animate-bounce" style={{animationDelay: '3s'}}></div>
            </div>

            {/* Floating Icons */}
            <span className="text-6xl fixed top-20 right-10 z-0 animate-bounce text-purple-400/60" style={{animationDelay: '0.5s'}}>🔢</span>
            <span className="text-5xl fixed bottom-20 left-10 z-0 animate-bounce text-blue-400/60" style={{animationDelay: '1.5s'}}>🎯</span>
            <span className="text-4xl fixed top-1/3 left-5 z-0 animate-pulse text-pink-400/60" style={{animationDelay: '2.5s'}}>✨</span>

            <main className="relative z-10 min-h-screen p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-r from-white/90 to-purple-100/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-8 inline-block">
                            <h1 className="text-5xl font-bold text-purple-600 drop-shadow-lg mb-4 animate-bounce">
                                🎉 Count & Match Game 🎉
                            </h1>
                            <p className="text-lg text-purple-500 font-semibold">
                                Count the objects and match them with the correct numbers!
                            </p>
                        </div>
                    </div>

                    {/* Game Stats */}
                    {gameStarted && (
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
                                    <div className="text-2xl font-bold">📈 {level}</div>
                                    <div className="text-sm">Level</div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">⏱️ {formatTime(timer)}</div>
                                    <div className="text-sm">Time</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Category Selector */}
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-white/50 p-6">
                            <h3 className="text-lg font-bold text-blue-700 mb-4 text-center">Choose Category:</h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                {Object.entries(objectCategories).map(([key, categoryObjs]) => (
                                    <button
                                        key={key}
                                        onClick={() => changeCategory(key)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                                            gameCategory === key
                                                ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg scale-105'
                                                : 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200'
                                        }`}
                                    >
                                        <span className="text-2xl">{categoryObjs[0].emoji}</span>
                                        <span className="capitalize">{key}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Game Content */}
                    <div className="bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-8">
                        {!gameStarted ? (
                            // Start Screen
                            <div className="text-center py-16">
                                <div className="text-8xl mb-8">🧮✨🎯🔢</div>
                                <h2 className="text-4xl font-bold text-purple-700 mb-6">Ready to Count and Match?</h2>
                                <p className="text-xl text-purple-600 mb-8">Look at the objects, count them, and match with the correct numbers!</p>
                                <button
                                    onClick={startGame}
                                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-12 py-4 rounded-2xl font-bold text-2xl shadow-xl transform hover:scale-105 transition-all duration-300"
                                >
                                    🚀 Start Game!
                                </button>
                            </div>
                        ) : (
                            // Game Grid
                            <div>
                                <div className="space-y-8 mb-8">
                                    {objects.map((object, index) => (
                                        <div key={index} className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 shadow-lg border-2 border-gray-200">
                                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                                {/* Object Display */}
                                                <div className="order-2 md:order-1">
                                                    <div className="relative bg-gradient-to-br from-sky-100 to-blue-200 rounded-xl p-6 min-h-[200px] border-2 border-blue-300 overflow-hidden">
                                                        {object.items.map((item) => (
                                                            <div
                                                                key={item.id}
                                                                className="absolute text-4xl drop-shadow-lg transition-transform duration-300 hover:scale-110"
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
                                                        <div className="absolute top-2 right-2 text-2xl opacity-40">☁️</div>
                                                        <div className="absolute bottom-2 left-2 text-xl opacity-30">☁️</div>
                                                    </div>
                                                    
                                                    <h3 className="text-2xl font-bold text-center mt-4 text-purple-600">
                                                        Count the {object.name}
                                                    </h3>
                                                    
                                                    {showResults && (
                                                        <div className={`text-center mt-3 text-xl font-bold ${isMatchCorrect(object.name) ? "text-green-600" : "text-red-600"}`}>
                                                            {isMatchCorrect(object.name) ? "✅ Correct!" : `❌ Wrong! (Answer: ${object.count})`}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Number Selection */}
                                                <div className="order-1 md:order-2">
                                                    <h4 className="text-xl font-bold text-center mb-4 text-blue-700">
                                                        How many {object.name}?
                                                    </h4>
                                                    <div className="grid grid-cols-5 gap-3">
                                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
                                                            <button
                                                                key={number}
                                                                className={`aspect-square rounded-xl text-lg font-bold border-2 transition-all duration-300 transform hover:scale-110 ${
                                                                    selectedMatches[object.name] === number
                                                                        ? `bg-gradient-to-r ${object.color} text-white border-blue-600 shadow-lg scale-105`
                                                                        : "bg-gradient-to-r from-yellow-200 to-orange-200 hover:from-yellow-300 hover:to-orange-300 text-gray-700 border-yellow-400"
                                                                }`}
                                                                onClick={() => handleMatch(object.name, number)}
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
                                        onClick={checkMatches}
                                        disabled={!allSelected}
                                        className={`px-8 py-4 rounded-2xl text-xl font-bold shadow-xl transform transition-all duration-300 ${
                                            allSelected
                                                ? "bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white hover:scale-105"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                    >
                                        {allSelected ? "🏁 Check Answers!" : "📝 Select all answers first"}
                                    </button>

                                    {showResults && allCorrect && (
                                        <button
                                            onClick={nextLevel}
                                            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-6 py-4 rounded-2xl font-bold shadow-xl transform hover:scale-105 transition-all duration-300"
                                        >
                                            🚀 Next Level
                                        </button>
                                    )}

                                    <button
                                        onClick={generateNewGame}
                                        className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-6 py-4 rounded-2xl font-bold shadow-xl transform hover:scale-105 transition-all duration-300"
                                    >
                                        🔄 New Game
                                    </button>

                                    <button
                                        onClick={resetGame}
                                        className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-4 rounded-2xl font-bold shadow-xl transform hover:scale-105 transition-all duration-300"
                                    >
                                        🏠 Main Menu
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
                                        <span>Look at each box and count the objects</span>
                                    </div>
                                    <div className="flex flex-col items-center space-y-2">
                                        <span className="text-4xl">🔢</span>
                                        <span>Click the correct number for each set</span>
                                    </div>
                                    <div className="flex flex-col items-center space-y-2">
                                        <span className="text-4xl">✅</span>
                                        <span>Check your answers and advance!</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Overall Results Display */}
            {showResults && allSelected && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
                    <div className={`px-8 py-4 rounded-2xl shadow-2xl border-2 font-bold text-xl ${
                        allCorrect 
                            ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white border-green-300" 
                            : "bg-gradient-to-r from-red-400 to-red-500 text-white border-red-300"
                    }`}>
                        {allCorrect 
                            ? "🎉 Perfect! All matches correct!" 
                            : `${objects.filter(obj => isMatchCorrect(obj.name)).length}/${objects.length} correct. Try again!`
                        }
                    </div>
                </div>
            )}
        </div>
    );
};

export default CountAndMatchGame;