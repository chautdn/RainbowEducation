import { useState, useEffect } from "react";
import { ArrowLeft, Volume2, RotateCcw, Play, SkipBack, SkipForward} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LessonDetailPage({ params }) {
    const navigate = useNavigate();
    const [selectedLetter, setSelectedLetter] = useState("A");
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationStep, setAnimationStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    const vietnameseLetters = [
        "A", "Ă", "Â", "B", "C", "D", "Đ", "E", "Ê", "G", "H",
        "I", "K", "L", "M", "N", "O", "Ô", "Ơ", "P", "Q", "R",
        "S", "T", "U", "Ư", "V", "X", "Y",
    ];

    const letterVideos = {
        "A": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199075/chu_a_dvvima.mp4",
        "Ă": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199190/chu_ă_f1p1mb.mp4",
        "Â": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199112/chu_â_afuqw3.mp4",
        "B": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199191/chu_b_mzwagg.mp4",
        "C": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199194/chu_c_hxr6ix.mp4",
        "D": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199213/chu_d_eeacra.mp4",
        "Đ": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199213/chu_đ_opwh1g.mp4",
        "E": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199214/chu_e_g3wf2b.mp4",
        "Ê": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199215/chu_ê_rsfxwz.mp4",
        "G": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199214/chu_g_jhu6rz.mp4",
        "H": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199235/chu_h_uy1vdr.mp4",
        "I": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199235/chu_i_irt4wm.mp4",
        "K": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199235/chu_k_xhj2n8.mp4",
        "L": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199235/chu_L_is0oh2.mp4",
        "M": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199236/chu_m_eiav1p.mp4",
        "N": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199236/chu_n_ibafw0.mp4",
        "O": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199237/chu_q_usrjfm.mp4",
        "Ô": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199236/chu_ô_g39lj0.mp4",
        "Ơ": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199236/chu_ơ_sz4l7r.mp4",
        "P": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749402008/chu_p_iuucnz.mp4",
        "Q": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199237/chu_q_usrjfm.mp4",
        "R": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199237/chu_r_dzrkwb.mp4",
        "S": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199241/chu_s_pdmav4.mp4",
        "T": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199242/chu_t_ubyuun.mp4",
        "U": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199242/chu_u_uloamw.mp4",
        "Ư": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199242/chu_ư_f4mx0b.mp4",
        "V": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199071/chu_v_h1fnc3.mp4",
        "X": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199071/chu_x_b5vour.mp4",
        "Y": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749199072/chu_y_qo3ehc.mp4",
    };
    // CSS styles để cố định kích thước
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

    useEffect(() => {
        speechSynthesis.onvoiceschanged = () => {
            console.log("Loaded voices:", speechSynthesis.getVoices());
        };
    }, []);

    const handleLetterSelect = (letter) => {
        setSelectedLetter(letter);
    };

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

    const toggleVideo = () => {
        setIsPlaying(!isPlaying);
    };

    const handlePrevVideo = () => {
        const currentIndex = vietnameseLetters.indexOf(selectedLetter);
        if (currentIndex > 0) {
            const prevLetter = vietnameseLetters[currentIndex - 1];
            setSelectedLetter(prevLetter);
            setIsPlaying(true);
        }
    };

    const handleNextVideo = () => {
        const currentIndex = vietnameseLetters.indexOf(selectedLetter);
        if (currentIndex < vietnameseLetters.length - 1) {
            const nextLetter = vietnameseLetters[currentIndex + 1];
            setSelectedLetter(nextLetter);
            setIsPlaying(true);
        }
    };

    const handleReplay = () => {
        setIsPlaying(false);
        setTimeout(() => {
            setIsPlaying(true);
        }, 100);
    };
    const handleNavigateBack = () => {
        navigate("/curriculum");
        console.log("Navigate back to curriculum");
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b-2 border-white/50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleNavigateBack}
                            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                            <span className="font-semibold">Quay lại</span>
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Chi tiết bài học</h1>
                        <div className="w-20"></div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-12 gap-8" style={{ height: 'calc(100vh - 200px)' }}>
                    {/* Left - Alphabet Grid (3/12 columns) */}
                    <div className="lg:col-span-3 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Chọn chữ cái</h2>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2 overflow-y-auto" style={{ height: 'calc(100% - 120px)' }}>
                            {vietnameseLetters.map((letter) => (
                                <button
                                    key={letter}
                                    onClick={() => handleLetterSelect(letter)}
                                    className={`aspect-square rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${selectedLetter === letter
                                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl scale-105"
                                        : "bg-gradient-to-br from-yellow-200 to-orange-200 text-gray-700 hover:from-yellow-300 hover:to-orange-300"
                                        }`}
                                >
                                    {letter}
                                </button>
                            ))}
                        </div>

                        {/* Progress indicator */}
                        <div className="mt-4 text-center text-sm text-gray-500">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-700">Tiến độ</span>
                                <span className="text-xs font-bold text-green-600">
                                    {vietnameseLetters.indexOf(selectedLetter) + 1}/{vietnameseLetters.length}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                                    style={{
                                        width: ((vietnameseLetters.indexOf(selectedLetter) + 1) / vietnameseLetters.length) * 100 + "%",
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Right - Animation/Video (9/12 columns) */}
                    <div className="lg:col-span-9 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-8 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-bold text-gray-800">Học Viết chữ</h2>
                            <div className="flex gap-3">
                                <button
                                    onClick={playSound}
                                    className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transform hover:scale-105 transition-all"
                                    title="Phát âm"
                                >
                                    <Volume2 className="w-6 h-6" />
                                </button>

                                {!letterVideos[selectedLetter] && (
                                    <button
                                        onClick={toggleVideo}
                                        className="p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-lg transform hover:scale-105 transition-all"
                                        title="Xem video"
                                    >
                                        <Play className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Video hoặc Animation Section */}
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
                                            onClick={handlePrevVideo}
                                            className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transform hover:scale-105 transition-all"
                                            title="Chữ trước"
                                            disabled={vietnameseLetters.indexOf(selectedLetter) === 0}
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
                                            onClick={handleNextVideo}
                                            className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transform hover:scale-105 transition-all"
                                            title="Chữ tiếp theo"
                                            disabled={vietnameseLetters.indexOf(selectedLetter) === vietnameseLetters.length - 1}
                                        >
                                            <SkipForward className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl border-2 border-dashed border-orange-200 relative overflow-hidden flex items-center justify-center">
                                    {/* Container cố định kích thước cho chữ cái */}
                                    <div style={letterContainerStyle}>
                                        <div
                                            className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isAnimating ? "text-blue-500" : "text-gray-700"
                                                }`}
                                            style={{
                                                transform: `scale(${isAnimating ? 1.1 : 1})`,
                                                filter: isAnimating ? "drop-shadow(0 0 30px rgba(59,130,246,0.5))" : "none",
                                            }}
                                        >
                                            <span
                                                className="select-none"
                                                style={letterTextStyle}
                                            >
                                                {selectedLetter}
                                            </span>
                                        </div>

                                        {/* Animation dots với position cố định */}
                                        {isAnimating && (
                                            <div className="absolute inset-0 pointer-events-none">
                                                <div
                                                    className={`absolute w-3 h-3 bg-red-500 rounded-full transition-all duration-800 ${animationStep >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-0"
                                                        }`}
                                                    style={{
                                                        top: '15%',
                                                        left: '50%',
                                                        transform: 'translateX(-50%)'
                                                    }}
                                                />
                                                <div
                                                    className={`absolute w-3 h-3 bg-red-500 rounded-full transition-all duration-800 delay-300 ${animationStep >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-0"
                                                        }`}
                                                    style={{
                                                        top: '50%',
                                                        left: '25%',
                                                        transform: 'translate(-50%, -50%)'
                                                    }}
                                                />
                                                <div
                                                    className={`absolute w-3 h-3 bg-red-500 rounded-full transition-all duration-800 delay-600 ${animationStep >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-0"
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
                                    <div className="absolute top-6 left-6 text-3xl animate-bounce">✨</div>
                                    <div className="absolute top-6 right-6 text-3xl animate-bounce" style={{ animationDelay: "0.5s" }}>🌟</div>
                                    <div className="absolute bottom-6 left-6 text-3xl animate-bounce" style={{ animationDelay: "1s" }}>🎨</div>
                                    <div className="absolute bottom-6 right-6 text-3xl animate-bounce" style={{ animationDelay: "1.5s" }}>📝</div>
                                </div>
                            )}
                        </div>

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
                </div>
            </main>
        </div>
    );
}