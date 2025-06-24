import { useState, useEffect } from "react";
import { ArrowLeft, Volume2, RotateCcw, Play, SkipBack, SkipForward} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NumberLessonPage() {
    const [selectedNumber, setSelectedNumber] = useState("0");
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationStep, setAnimationStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const navigate = useNavigate();

    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    const numberVideos = {
        "0": "https://res.cloudinary.com/dctmuwsdx/video/upload/v1749460007/llfj3b4odnvtcs15bnxg.mp4",
        "1": "https://res.cloudinary.com/dctmuwsdx/video/upload/v1749460002/yfoygkveduxr2oeizhwk.mp4",
        "2": "https://res.cloudinary.com/dctmuwsdx/video/upload/v1749460011/hcy0u7rhzrvae3b11dy6.mp4",
        "3": "https://res.cloudinary.com/dctmuwsdx/video/upload/v1749460003/apovymewqwafs2psgubs.mp4",
        "4": "https://res.cloudinary.com/dctmuwsdx/video/upload/v1749460004/s6d7ynuflntbqkuge0n9.mp4",
        "5": "https://res.cloudinary.com/dctmuwsdx/video/upload/v1749460002/vtsorw4zqifjr8dxqttp.mp4",
        "6": "https://res.cloudinary.com/dctmuwsdx/video/upload/v1749460016/ny0nruhgzsasaweaqzqa.mp4",
        "7": "https://res.cloudinary.com/dctmuwsdx/video/upload/v1749460008/liyo0mn7ke4axrj9tbk9.mp4",
        "8": "https://res.cloudinary.com/dctmuwsdx/video/upload/v1749460007/qkqggh84uc2cpfukijss.mp4",
        "9": "https://res.cloudinary.com/dctmuwsdx/video/upload/v1749460011/k2hhpvpsf4te3snuexis.mp4",
    };

    // CSS styles để cố định kích thước
    const numberContainerStyle = {
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

    const numberTextStyle = {
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
        if (numberVideos[selectedNumber]) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
            startAnimation();
        }
    }, [selectedNumber]);

    useEffect(() => {
        speechSynthesis.onvoiceschanged = () => {
            // Voices loaded
        };
    }, []);

    const handleNumberSelect = (number) => {
        setSelectedNumber(number);
    };

    const playSound = () => {
        const utterance = new SpeechSynthesisUtterance(selectedNumber);
        utterance.lang = "vi-VN";
        const voices = speechSynthesis.getVoices();
        const vietnameseVoice = voices.find((voice) => voice.lang === "vi-VN");
        if (vietnameseVoice) {
            utterance.voice = vietnameseVoice;
        }
        speechSynthesis.speak(utterance);
    };

    const toggleVideo = () => {
        setIsPlaying(!isPlaying);
    };

    const handlePrevVideo = () => {
        const currentIndex = numbers.indexOf(selectedNumber);
        if (currentIndex > 0) {
            const prevNumber = numbers[currentIndex - 1];
            setSelectedNumber(prevNumber);
            setIsPlaying(true);
        }
    };

    const handleNextVideo = () => {
        const currentIndex = numbers.indexOf(selectedNumber);
        if (currentIndex < numbers.length - 1) {
            const nextNumber = numbers[currentIndex + 1];
            setSelectedNumber(nextNumber);
            setIsPlaying(true);
        }
    };

    const handleReplay = () => {
        setIsPlaying(false);
        setTimeout(() => {
            setIsPlaying(true);
        }, 100);
    };

    // Updated navigation to go back to curriculum or home
    const handleNavigateBack = () => {
        // Try to go back to the previous page, or default to curriculum
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/curriculum");
        }
    };

    const getNumberName = (number) => {
        const numberNames = {
            "0": "không",
            "1": "một", 
            "2": "hai",
            "3": "ba",
            "4": "bốn",
            "5": "năm",
            "6": "sáu",
            "7": "bảy",
            "8": "tám",
            "9": "chín"
        };
        return numberNames[number] || number;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-cyan-100">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b-2 border-white/50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleNavigateBack}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                            <span className="font-semibold">Quay lại</span>
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Học viết số</h1>
                        <div className="w-20"></div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-12 gap-8" style={{ height: 'calc(100vh - 200px)' }}>
                    {/* Left - Numbers Grid (3/12 columns) */}
                    <div className="lg:col-span-3 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Chọn số</h2>
                        <div className="grid grid-cols-2 gap-3 overflow-y-auto" style={{ height: 'calc(100% - 120px)' }}>
                            {numbers.map((number) => (
                                <button
                                    key={number}
                                    onClick={() => handleNumberSelect(number)}
                                    className={`aspect-square rounded-2xl font-bold text-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex flex-col items-center justify-center ${selectedNumber === number
                                            ? "bg-gradient-to-br from-green-500 to-blue-600 text-white shadow-2xl scale-105"
                                            : "bg-gradient-to-br from-cyan-200 to-blue-200 text-gray-700 hover:from-cyan-300 hover:to-blue-300"
                                        }`}
                                >
                                    <span className="text-3xl mb-1">{number}</span>
                                    <span className="text-xs font-medium">{getNumberName(number)}</span>
                                </button>
                            ))}
                        </div>

                        {/* Progress indicator */}
                        <div className="mt-4 text-center text-sm text-gray-500">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-700">Tiến độ</span>
                                <span className="text-xs font-bold text-green-600">
                                    {numbers.indexOf(selectedNumber) + 1}/{numbers.length}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                                    style={{
                                        width: ((numbers.indexOf(selectedNumber) + 1) / numbers.length) * 100 + "%",
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Right - Animation/Video (9/12 columns) */}
                    <div className="lg:col-span-9 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-8 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-bold text-gray-800">Học viết số</h2>
                            <div className="flex gap-3">
                                <button
                                    onClick={playSound}
                                    className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transform hover:scale-105 transition-all"
                                    title="Phát âm"
                                >
                                    <Volume2 className="w-6 h-6" />
                                </button>

                                {!numberVideos[selectedNumber] && (
                                    <button
                                        onClick={toggleVideo}
                                        className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transform hover:scale-105 transition-all"
                                        title="Xem video"
                                    >
                                        <Play className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Video hoặc Animation Section */}
                        <div className="flex-1 flex items-center justify-center">
                            {isPlaying && numberVideos[selectedNumber] ? (
                                <div className="w-full max-w-4xl">
                                    <video
                                        className="w-full rounded-2xl shadow-2xl"
                                        controls={false}
                                        autoPlay={false}
                                        src={numberVideos[selectedNumber]}
                                        id="numberVideo"
                                        style={{ maxHeight: '400px', objectFit: 'contain' }}
                                    />
                                    <div className="flex justify-center gap-4 mt-6">
                                        <button
                                            onClick={handlePrevVideo}
                                            className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Số trước"
                                            disabled={numbers.indexOf(selectedNumber) === 0}
                                        >
                                            <SkipBack className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={handleReplay}
                                            className="p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-lg transform hover:scale-105 transition-all"
                                            title="Xem lại"
                                        >
                                            <RotateCcw className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                const video = document.getElementById("numberVideo");
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
                                            onClick={handleNextVideo}
                                            className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Số tiếp theo"
                                            disabled={numbers.indexOf(selectedNumber) === numbers.length - 1}
                                        >
                                            <SkipForward className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl border-2 border-dashed border-blue-200 relative overflow-hidden flex items-center justify-center">
                                    {/* Container cố định kích thước cho số */}
                                    <div style={numberContainerStyle}>
                                        <div
                                            className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isAnimating ? "text-green-500" : "text-gray-700"
                                                }`}
                                            style={{
                                                transform: `scale(${isAnimating ? 1.1 : 1})`,
                                                filter: isAnimating ? "drop-shadow(0 0 30px rgba(34,197,94,0.5))" : "none",
                                            }}
                                        >
                                            <span
                                                className="select-none"
                                                style={numberTextStyle}
                                            >
                                                {selectedNumber}
                                            </span>
                                        </div>

                                        {/* Animation dots với position cố định */}
                                        {isAnimating && (
                                            <div className="absolute inset-0 pointer-events-none">
                                                <div
                                                    className={`absolute w-3 h-3 bg-orange-500 rounded-full transition-all duration-800 ${animationStep >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-0"
                                                        }`}
                                                    style={{
                                                        top: '15%',
                                                        left: '50%',
                                                        transform: 'translateX(-50%)'
                                                    }}
                                                />
                                                <div
                                                    className={`absolute w-3 h-3 bg-orange-500 rounded-full transition-all duration-800 delay-300 ${animationStep >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-0"
                                                        }`}
                                                    style={{
                                                        top: '50%',
                                                        left: '25%',
                                                        transform: 'translate(-50%, -50%)'
                                                    }}
                                                />
                                                <div
                                                    className={`absolute w-3 h-3 bg-orange-500 rounded-full transition-all duration-800 delay-600 ${animationStep >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-0"
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

                                    {/* Decorative elements với position cố định */}
                                    <div className="absolute top-6 left-6 text-3xl animate-bounce">🔢</div>
                                    <div className="absolute top-6 right-6 text-3xl animate-bounce" style={{ animationDelay: "0.5s" }}>🎯</div>
                                    <div className="absolute bottom-6 left-6 text-3xl animate-bounce" style={{ animationDelay: "1s" }}>✏️</div>
                                    <div className="absolute bottom-6 right-6 text-3xl animate-bounce" style={{ animationDelay: "1.5s" }}>📊</div>
                                </div>
                            )}
                        </div>

                        {/* Info Section */}
                        <div className="mt-6 p-6 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl">
                            <h3 className="font-bold text-2xl text-blue-800 mb-3">
                                Số: {selectedNumber} ({getNumberName(selectedNumber)})
                            </h3>
                            <p className="text-blue-600 text-lg">
                                Hãy xem video để học cách viết số {selectedNumber} và thực hành theo hướng dẫn!
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}