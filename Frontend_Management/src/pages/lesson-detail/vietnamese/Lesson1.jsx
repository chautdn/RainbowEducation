import React, { useState, useEffect } from "react";
import { ArrowLeft, Volume2, Play, SkipBack, SkipForward, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { letterGroups } from "../../../data/courseData";
import LessonCompleteModal from "../../../components/sharedComponents/LessonCompleteModal";
import { useLearningProgress } from "../../../hooks/useLearningProgress";

export default function LessonDetailPage() {
    const [selectedLetter, setSelectedLetter] = useState(letterGroups[0].letters[0]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationStep, setAnimationStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentGroup, setCurrentGroup] = useState(0);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [completedLetters, setCompletedLetters] = useState(new Set());
    const [lessonProgress, setLessonProgress] = useState(0);
    const [showResumeMessage, setShowResumeMessage] = useState(false);
    const [resumeReason, setResumeReason] = useState('');
    
    // Progress tracking
    const { 
        startLesson, 
        completeLesson, 
        updateLessonProgress,
        getLessonProgress 
    } = useLearningProgress();
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

    // Initialize lesson progress on component mount
    useEffect(() => {
        // Set lesson start time for time tracking
        sessionStorage.setItem('lessonStartTime', Date.now().toString());
        
        // Load existing progress
        const existingProgress = getLessonProgress('vietnamese', 1);
        
        if (existingProgress && existingProgress.completedLetters) {
            setCompletedLetters(new Set(existingProgress.completedLetters));
            setLessonProgress(existingProgress.progress || 0);
            
            // Smart resume using new logic
            const resumePosition = findResumePosition(existingProgress);
            
            if (resumePosition) {
                setCurrentGroup(resumePosition.groupIndex);
                setSelectedLetter(resumePosition.letter);
                setResumeReason(resumePosition.reason);
                setShowResumeMessage(true);
                
                // Hide message after 4 seconds
                setTimeout(() => setShowResumeMessage(false), 4000);
            }
        }
    }, []);

    useEffect(() => {
        if (letterVideos[selectedLetter]) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
            startAnimation();
        }
        
        // Mark letter as studied and update progress
        markLetterAsStudied(selectedLetter);
    }, [selectedLetter]);

    useEffect(() => {
        const video = document.getElementById("letterVideo");

        if (video && selectedLetter === "Y" && isPlaying) {
            const handleVideoEnd = () => {
                setShowModal(true); // <-- Hiển thị modal khi video kết thúc
            };

            video.addEventListener("ended", handleVideoEnd);
            return () => {
                video.removeEventListener("ended", handleVideoEnd);
            };
        }
    }, [selectedLetter, isPlaying]);

    // Mark letter as studied and calculate progress
    const markLetterAsStudied = (letter) => {
        const newCompletedLetters = new Set([...completedLetters, letter]);
        setCompletedLetters(newCompletedLetters);
        
        // Calculate total progress across all groups
        const totalLetters = letterGroups.reduce((total, group) => total + group.letters.length, 0);
        const newProgress = (newCompletedLetters.size / totalLetters) * 100;
        setLessonProgress(newProgress);
        
        // Update progress in localStorage with detailed data
        const timeSpentSeconds = Math.round((Date.now() - (sessionStorage.getItem('lessonStartTime') || Date.now())) / 1000);
        const isLessonCompleted = newCompletedLetters.size === totalLetters;
        
        const progressData = {
            completed: isLessonCompleted,
            score: Math.round(newProgress),
            timeSpent: timeSpentSeconds,
            progress: newProgress,
            completedLetters: Array.from(newCompletedLetters),
            currentLetter: letter,
            currentGroup: currentGroup,
            lastStudiedAt: new Date().toISOString()
        };
        
        updateLessonProgress('vietnamese', 1, progressData);
        
        // Check if lesson is complete (all letters studied)
        if (newCompletedLetters.size === totalLetters) {
            setTimeout(() => {
                const timeSpentSeconds = Math.round((Date.now() - (sessionStorage.getItem('lessonStartTime') || Date.now())) / 1000);
                completeLesson('vietnamese', 1, Math.round(newProgress), timeSpentSeconds);
                setShowModal(true);
            }, 1000);
        }
    };

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
            const newGroup = currentGroup - 1;
            setCurrentGroup(newGroup);
            setSelectedLetter(letterGroups[newGroup].letters[0]);
        }
    };

    const handleNextGroup = () => {
        if (currentGroup < letterGroups.length - 1) {
            const newGroup = currentGroup + 1;
            setCurrentGroup(newGroup);
            setSelectedLetter(letterGroups[newGroup].letters[0]);
        }
    };

    // Helper function to find next unlearned letter with smart group progression
    const findNextUnlearnedLetter = (completedSet) => {
        for (let groupIndex = 0; groupIndex < letterGroups.length; groupIndex++) {
            const group = letterGroups[groupIndex];
            
            // Check if current group has any unlearned letters
            const unlearnedInGroup = group.letters.filter(letter => !completedSet.has(letter));
            
            if (unlearnedInGroup.length > 0) {
                // Return first unlearned letter in this group
                return { 
                    letter: unlearnedInGroup[0], 
                    groupIndex 
                };
            }
        }
        return null; // All letters completed
    };

    // Helper function to check if a group is completely learned
    const isGroupCompleted = (groupIndex, completedSet) => {
        const group = letterGroups[groupIndex];
        return group.letters.every(letter => completedSet.has(letter));
    };

    // Helper function to find appropriate group/letter for resume
    const findResumePosition = (existingProgress) => {
        const completedSet = new Set(existingProgress.completedLetters || []);
        
        // If we have currentLetter and currentGroup saved, check if that group is still valid
        if (existingProgress.currentLetter && existingProgress.currentGroup !== undefined) {
            const savedGroup = existingProgress.currentGroup;
            
            // Check if the saved group is completed
            if (isGroupCompleted(savedGroup, completedSet)) {
                const nextUnlearned = findNextUnlearnedLetter(completedSet);
                if (nextUnlearned) {
                    return {
                        letter: nextUnlearned.letter,
                        groupIndex: nextUnlearned.groupIndex,
                        reason: 'group_completed'
                    };
                }
            } else {
                // Group not completed, resume at saved position
                return {
                    letter: existingProgress.currentLetter,
                    groupIndex: savedGroup,
                    reason: 'resume_saved_position'
                };
            }
        }
        
        // No saved position or invalid saved position, find next unlearned
        const nextUnlearned = findNextUnlearnedLetter(completedSet);
        if (nextUnlearned) {
            return {
                letter: nextUnlearned.letter,
                groupIndex: nextUnlearned.groupIndex,
                reason: 'next_unlearned'
            };
        }
        
        return null;
    };



    const handleNavigateBack = () => {
        navigate("/curriculum");
    };

    return (
        <div className="h-screen overflow-y-auto bg-gradient-to-br from-sky-100 via-purple-50 to-pink-100">
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
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-800">Bài học Tiếng Việt 1</h1>
                            <div className="mt-2 flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-blue-400 to-green-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${lessonProgress}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-semibold text-green-600">
                                        {lessonProgress.toFixed(1)}%
                                    </span>
                                </div>
                                <span className="text-sm text-gray-600">
                                    {completedLetters.size}/{letterGroups.reduce((total, group) => total + group.letters.length, 0)} chữ cái
                                </span>
                            </div>
                        </div>
                        <div className="w-20"></div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Resume Message */}
                {showResumeMessage && (
                    <div className="mb-6 p-4 bg-blue-100 border-l-4 border-blue-500 rounded-r-lg animate-pulse">
                        <div className="flex items-center">
                            <div className="text-2xl mr-3">
                                {resumeReason === 'group_completed' ? '🎉' : '🎯'}
                            </div>
                            <div>
                                <h4 className="font-bold text-blue-800">
                                    {resumeReason === 'group_completed' 
                                        ? 'Tuyệt vời! Bạn đã hoàn thành nhóm trước!' 
                                        : 'Chào mừng bạn quay lại!'
                                    }
                                </h4>
                                <p className="text-blue-600">
                                    {resumeReason === 'group_completed' 
                                        ? `Chuyển sang ${letterGroups[currentGroup]?.name} - Tiếp tục với chữ ${selectedLetter}`
                                        : resumeReason === 'resume_saved_position'
                                            ? `Quay lại vị trí cuối: chữ ${selectedLetter} trong ${letterGroups[currentGroup]?.name}`
                                            : `Tiếp tục từ chữ ${selectedLetter} trong ${letterGroups[currentGroup]?.name}`
                                    }
                                </p>
                                <p className="text-blue-500 text-sm mt-1">
                                    Đã học: {completedLetters.size} chữ cái ({lessonProgress.toFixed(1)}%)
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-12 gap-8" style={{ height: 'calc(100vh - 200px)' }}>
                    {/* Left - Alphabet Grid */}
                    <div className="lg:col-span-3 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800">{letterGroups[currentGroup].name}</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrevGroup}
                                    disabled={currentGroup === 0}
                                    className={`p-2 rounded-full ${currentGroup === 0
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-purple-500 text-white hover:bg-purple-600"
                                        }`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleNextGroup}
                                    disabled={currentGroup === letterGroups.length - 1}
                                    className={`p-2 rounded-full ${currentGroup === letterGroups.length - 1
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-purple-500 text-white hover:bg-purple-600"
                                        }`}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Alphabet Grid - Vertical Column */}
                        <div className="flex flex-col gap-6 overflow-y-auto items-center justify-center" style={{ height: 'calc(100% - 120px)' }}>
                            {letterGroups[currentGroup].letters.map((letter) => {
                                const isCompleted = completedLetters.has(letter);
                                const isSelected = selectedLetter === letter;
                                
                                return (
                                    <button
                                        key={letter}
                                        onClick={() => handleLetterSelect(letter)}
                                        className={`rounded-3xl font-bold text-7xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center relative ${
                                            isSelected
                                                ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl scale-105"
                                                : isCompleted
                                                    ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white"
                                                    : "bg-gradient-to-br from-yellow-200 to-orange-200 text-gray-700 hover:from-yellow-300 hover:to-orange-300"
                                        }`}
                                        style={{
                                            height: '180px',
                                            width: '90%',
                                            boxShadow: isSelected
                                                ? '0 10px 25px -5px rgba(59, 130, 246, 0.5)'
                                                : isCompleted
                                                    ? '0 10px 25px -5px rgba(34, 197, 94, 0.4)'
                                                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    >
                                        <span className="transform hover:scale-110 transition-transform duration-300">
                                            {letter}
                                        </span>
                                        {isCompleted && !isSelected && (
                                            <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                                <span className="text-green-500 text-sm font-bold">✓</span>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
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
                                {/* Quick Jump to Next Unlearned */}
                                {(() => {
                                    const nextUnlearned = findNextUnlearnedLetter(completedLetters);
                                    return nextUnlearned && nextUnlearned.letter !== selectedLetter ? (
                                        <button
                                            onClick={() => {
                                                setCurrentGroup(nextUnlearned.groupIndex);
                                                setSelectedLetter(nextUnlearned.letter);
                                            }}
                                            className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow-lg text-sm font-semibold transition-all"
                                            title={`Nhảy đến chữ ${nextUnlearned.letter} chưa học`}
                                        >
                                            → {nextUnlearned.letter}
                                        </button>
                                    ) : null;
                                })()}
                                
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
                                            className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isAnimating ? "text-blue-500" : "text-gray-700"
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

                                    <div className="absolute top-6 left-6 text-3xl animate-bounce">✨</div>
                                    <div className="absolute top-6 right-6 text-3xl animate-bounce" style={{ animationDelay: "0.5s" }}>🌟</div>
                                    <div className="absolute bottom-6 left-6 text-3xl animate-bounce" style={{ animationDelay: "1s" }}>🎨</div>
                                    <div className="absolute bottom-6 right-6 text-3xl animate-bounce" style={{ animationDelay: "1.5s" }}>📝</div>
                                </div>
                            )}
                        </div>

                        {/* Info Section */}
                        <div className="mt-6 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-2xl text-purple-800">Chữ cái: {selectedLetter}</h3>
                                {completedLetters.has(selectedLetter) && (
                                    <div className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full">
                                        <span className="text-sm font-semibold">✓ Đã học</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-purple-600 text-lg mb-3">
                                {selectedLetter === "A"
                                    ? "Hãy xem video để học cách viết chữ A!"
                                    : `Hãy quan sát cách đọc chữ ${selectedLetter} và thực hành theo!`}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                    <span className="text-gray-600">Đã học: {completedLetters.size} chữ</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                    <span className="text-gray-600">
                                        Còn lại: {letterGroups.reduce((total, group) => total + group.letters.length, 0) - completedLetters.size} chữ
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {showModal && (
                    <LessonCompleteModal
                        onClose={() => setShowModal(false)}
                        onContinuePath={`/lesson-detail/vietnamese/lesson2`} // hoặc path bất kỳ bạn muốn
                    />
                )}
            </main>
        </div>
    );
}