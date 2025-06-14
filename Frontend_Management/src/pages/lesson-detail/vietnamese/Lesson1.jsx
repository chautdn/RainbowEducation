import { useState, useEffect } from "react";
import { ArrowLeft, Volume2, Play, SkipBack, SkipForward, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { letterGroups } from "../../../data/courseData";

export default function LessonDetailPage() {
    const [selectedLetter, setSelectedLetter] = useState(letterGroups[0].letters[0]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationStep, setAnimationStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentGroup, setCurrentGroup] = useState(0);
    const navigate = useNavigate();

    const letterVideos = {
        "A": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749178684/chu_a_yfojk7.mp4",
        "Ă": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749178684/chu_ă_u25h2u.mp4",
        "Â": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749178684/chu_â_ddb4h7.mp4",
        "B": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749180393/chu_b_wt6jyk.mp4",
        "C": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749180588/chu_c_o5oxl4.mp4",
        "D": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749180588/chu_d_ebbhrj.mp4",
        "Đ": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749181262/chu_đ_zd4uot.mp4",
        "E": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749181262/chu_e_n2aetm.mp4",
        "Ê": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749181261/chu_ê_igd1si.mp4",
        "G": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749182045/chu_g_kzikqj.mp4",
        "H": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749182045/chu_h_ovqwxi.mp4",
        "I": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749182045/chu_i_qzqz0y.mp4",
        "K": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749182685/chu_k_e5spos.mp4",
        "L": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749182685/chu_l_zlrlg8.mp4",
        "M": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749182685/chu_m_wxpupi.mp4",
        "N": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749183199/chu_n_ottmpx.mp4",
        "O": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749183199/chu_o_bl0bxg.mp4",
        "Ô": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749183199/chu_ô_b5hkzp.mp4",
        "Ơ": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749183462/chu_ơ_d0k3fk.mp4",
        "P": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749183461/chu_p_lim81a.mp4",
        "Q": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749183461/chu_q_tcr9eo.mp4",
        "R": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749184068/chu_r_nf7lfm.mp4",
        "S": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749184068/chu_s_lvjztq.mp4",
        "T": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749184067/chu_t_oatbwm.mp4",
        "U": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749184619/chu_u_xax8be.mp4",
        "Ư": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749184620/chu_ư_cmgdch.mp4",
        "V": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749184619/chu_v_azjycs.mp4",
        "X": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749185316/chu_x_zyek1g.mp4",
        "Y": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749185317/chu_y_xkb1kq.mp4",
    };

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
        const video = document.getElementById("letterVideo");

        if (video && selectedLetter === "Y" && isPlaying) {
            const handleVideoEnd = () => {
                toast.info(
                    <div className="flex flex-col items-center">
                        <p className="font-bold text-lg mb-2">🎉 Xuất sắc! Bạn đã hoàn thành tất cả chữ cái!</p>
                        <p className="mb-4">Bạn có muốn tiếp tục với bài học viết chữ thường không?</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    toast.dismiss();
                                    navigate("/lesson-detail/vietnamese/lesson2");
                                }}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Tiếp tục học
                            </button>
                            <button
                                onClick={() => {
                                    toast.dismiss();
                                    navigate("/curriculum");
                                }}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Về trang chủ
                            </button>
                            <button
                                onClick={() => toast.dismiss()}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Để sau
                            </button>
                        </div>
                    </div>,
                    {
                        position: "top-center",
                        autoClose: false,
                        closeOnClick: false,
                        draggable: false,
                        className: "custom-toast",
                    }
                );
            };

            video.addEventListener('ended', handleVideoEnd);
            return () => video.removeEventListener('ended', handleVideoEnd);
        }
    }, [selectedLetter, isPlaying, navigate]);

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
        const currentIndex = letterGroups[currentGroup].letters.indexOf(selectedLetter);
        if (currentIndex > 0) {
            const prevLetter = letterGroups[currentGroup].letters[currentIndex - 1];
            setSelectedLetter(prevLetter);
            setIsPlaying(true);
        }
    };

    const handleNextVideo = () => {
        const currentIndex = letterGroups[currentGroup].letters.indexOf(selectedLetter);
        if (currentIndex < letterGroups[currentGroup].letters.length - 1) {
            const nextLetter = letterGroups[currentGroup].letters[currentIndex + 1];
            setSelectedLetter(nextLetter);
            setIsPlaying(true);
        }
    };

    const handlePrevGroup = () => {
        if (currentGroup > 0) {
            setCurrentGroup(currentGroup - 1);
            setSelectedLetter(letterGroups[currentGroup - 1].letters[0]);
        }
    };

    const handleNextGroup = () => {
        if (currentGroup < letterGroups.length - 1) {
            setCurrentGroup(currentGroup + 1);
            setSelectedLetter(letterGroups[currentGroup + 1].letters[0]);
        }
    };

    const handleNavigateBack = () => {
        navigate("/curriculum");
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
                    {/* Left - Alphabet Grid */}
                    <div className="lg:col-span-3 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800">{letterGroups[currentGroup].name}</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrevGroup}
                                    disabled={currentGroup === 0}
                                    className={`p-2 rounded-full ${
                                        currentGroup === 0
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-purple-500 text-white hover:bg-purple-600"
                                    }`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleNextGroup}
                                    disabled={currentGroup === letterGroups.length - 1}
                                    className={`p-2 rounded-full ${
                                        currentGroup === letterGroups.length - 1
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-purple-500 text-white hover:bg-purple-600"
                                    }`}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{letterGroups[currentGroup].description}</p>
                        
                        {/* Alphabet Grid - Vertical Column */}
                        <div className="flex flex-col gap-6 overflow-y-auto items-center justify-center" style={{ height: 'calc(100% - 120px)' }}>
                            {letterGroups[currentGroup].letters.map((letter) => (
                                <button
                                    key={letter}
                                    onClick={() => handleLetterSelect(letter)}
                                    className={`rounded-3xl font-bold text-7xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center ${
                                        selectedLetter === letter
                                            ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl scale-105"
                                            : "bg-gradient-to-br from-yellow-200 to-orange-200 text-gray-700 hover:from-yellow-300 hover:to-orange-300"
                                    }`}
                                    style={{
                                        height: '180px',     // Tăng chiều cao cho mỗi button
                                        width: '90%',       // Chiều rộng đầy đủ
                                        boxShadow: selectedLetter === letter 
                                            ? '0 10px 25px -5px rgba(59, 130, 246, 0.5)' 
                                            : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    <span className="transform hover:scale-110 transition-transform duration-300">
                                        {letter}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Progress indicator */}
                        <div className="mt-4 text-center text-sm text-gray-500">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-700">Tiến độ</span>
                                <span className="text-xs font-bold text-green-600">
                                    {letterGroups[currentGroup].letters.indexOf(selectedLetter) + 1}/{letterGroups[currentGroup].letters.length}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                                    style={{
                                        width: ((letterGroups[currentGroup].letters.indexOf(selectedLetter) + 1) / letterGroups[currentGroup].letters.length) * 100 + "%",
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Right - Animation/Video */}
                    <div className="lg:col-span-9 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-8 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-bold text-gray-800">Học đọc chữ</h2>
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
                                            disabled={letterGroups[currentGroup].letters.indexOf(selectedLetter) === 0}
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
                                            onClick={handleNextVideo}
                                            className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transform hover:scale-105 transition-all"
                                            title="Chữ tiếp theo"
                                            disabled={letterGroups[currentGroup].letters.indexOf(selectedLetter) === letterGroups[currentGroup].letters.length - 1}
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