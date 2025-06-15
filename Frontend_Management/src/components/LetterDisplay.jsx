import { useState, useEffect } from "react";
import { Volume2, Play, SkipBack, SkipForward } from "lucide-react";
import { letterVideos } from "../data/courseData";

export default function LetterDisplay({ selectedLetter, onLetterSelect, letters, groupInfo }) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationStep, setAnimationStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const letterContainerStyle = {
        width: '400px',
        height: '400px',
        minWidth: '400px',
        minHeight: '400px',
        maxWidth: '400px',
        maxHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    };

    const letterTextStyle = {
        fontSize: '12rem',
        lineHeight: '1',
        fontWeight: 'bold',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        verticalAlign: 'baseline',
        fontVariantNumeric: 'tabular-nums'
    };

    const startAnimation = () => {
        setIsAnimating(true);
        setAnimationStep(0);
        let currentStep = 0;
        const steps = 3;

        const interval = setInterval(() => {
            currentStep++;
            setAnimationStep(currentStep);

            if (currentStep >= steps) {
                clearInterval(interval);
                setTimeout(() => {
                    setIsAnimating(false);
                    setAnimationStep(0);
                }, 1000);
            }
        }, 800);
    };

    useEffect(() => {
        if (letterVideos[selectedLetter]) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
            startAnimation();
        }
    }, [selectedLetter]);

    const playSound = () => {
        const utterance = new SpeechSynthesisUtterance(selectedLetter);
        utterance.lang = "vi-VN";
        const voices = speechSynthesis.getVoices();
        const vietnameseVoice = voices.find((voice) => voice.lang === "vi-VN");
        if (vietnameseVoice) {
            utterance.voice = vietnameseVoice;
        }
        speechSynthesis.speak(utterance);
    };

    const handlePrevLetter = () => {
        const currentIndex = letters.indexOf(selectedLetter);
        if (currentIndex > 0) {
            onLetterSelect(letters[currentIndex - 1]);
        }
    };

    const handleNextLetter = () => {
        const currentIndex = letters.indexOf(selectedLetter);
        if (currentIndex < letters.length - 1) {
            onLetterSelect(letters[currentIndex + 1]);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center">
            {isPlaying && letterVideos[selectedLetter] ? (
                <div className="w-full max-w-4xl">
                    <video
                        className="w-full rounded-2xl shadow-2xl"
                        controls={false}
                        autoPlay={false}
                        src={letterVideos[selectedLetter]}
                        id="letterVideo"
                        style={{ maxHeight: '400px', objectFit: 'contain' }}
                    />
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={handlePrevLetter}
                            className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transform hover:scale-105 transition-all"
                            title="Chữ trước"
                            disabled={letters.indexOf(selectedLetter) === 0}
                        >
                            <SkipBack className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => {
                                const video = document.getElementById("letterVideo");
                                if (video) {
                                    if (video.paused) {
                                        video.play();
                                    } else {
                                        video.pause();
                                    }
                                }
                            }}
                            className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transform hover:scale-105 transition-all"
                            title="Phát/Tạm dừng"
                        >
                            <Play className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleNextLetter}
                            className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transform hover:scale-105 transition-all"
                            title="Chữ tiếp theo"
                            disabled={letters.indexOf(selectedLetter) === letters.length - 1}
                        >
                            <SkipForward className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl border-2 border-dashed border-orange-200 relative overflow-hidden flex items-center justify-center">
                    <div style={letterContainerStyle}>
                        <div
                            className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
                                isAnimating ? "text-blue-500" : "text-gray-700"
                            }`}
                            style={{
                                transform: `scale(${isAnimating ? 1.1 : 1})`,
                                filter: isAnimating ? "drop-shadow(0 0 30px rgba(59,130,246,0.5))" : "none",
                            }}
                        >
                            <span className="select-none" style={letterTextStyle}>
                                {selectedLetter}
                            </span>
                        </div>

                        {isAnimating && (
                            <div className="absolute inset-0 pointer-events-none">
                                <div
                                    className={`absolute w-3 h-3 bg-red-500 rounded-full transition-all duration-800 ${
                                        animationStep >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-0"
                                    }`}
                                    style={{
                                        top: '15%',
                                        left: '50%',
                                        transform: 'translateX(-50%)'
                                    }}
                                />
                                <div
                                    className={`absolute w-3 h-3 bg-red-500 rounded-full transition-all duration-800 delay-300 ${
                                        animationStep >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-0"
                                    }`}
                                    style={{
                                        top: '50%',
                                        left: '25%',
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                />
                                <div
                                    className={`absolute w-3 h-3 bg-red-500 rounded-full transition-all duration-800 delay-600 ${
                                        animationStep >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-0"
                                    }`}
                                    style={{
                                        top: '50%',
                                        left: '75%',
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="absolute top-6 left-6 text-3xl animate-bounce">✨</div>
                    <div className="absolute top-6 right-6 text-3xl animate-bounce" style={{ animationDelay: "0.5s" }}>🌟</div>
                    <div className="absolute bottom-6 left-6 text-3xl animate-bounce" style={{ animationDelay: "1s" }}>🎨</div>
                    <div className="absolute bottom-6 right-6 text-3xl animate-bounce" style={{ animationDelay: "1.5s" }}>📝</div>
                </div>
            )}

            {/* Info Section */}
            <div className="mt-6 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
                <h3 className="font-bold text-2xl text-purple-800 mb-3">Chữ cái: {selectedLetter}</h3>
                <p className="text-purple-600 text-lg">
                    {selectedLetter === "A"
                        ? "Hãy xem video để học cách viết chữ A!"
                        : `Hãy quan sát cách đọc chữ ${selectedLetter} và thực hành theo!`}
                </p>
            </div>
        </div>
    );
} 