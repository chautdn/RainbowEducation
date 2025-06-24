import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Volume2, ArrowLeft, Lock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { PaymentService } from "../../../services/paymentService"
import PaymentModal from "../../../components/sharedComponents/PaymentModal"
import { toast } from "react-toastify"
import { useAuthStore } from "../../../store/authStore"
import { useLearningProgress } from "../../../hooks/useLearningProgress"
const animals = [
    {
        id: 1,
        name: "Chó",
        image: "https://res.cloudinary.com/dvcpy4kmm/image/upload/v1749548146/dog_1_egkvgx.jpg",
        sound: "Chó kêu gâu gâu!",
        soundUrl: "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749898543/dog-bark-179915_nnrmkj.mp3",
        color: "bg-yellow-400",
    },
    {
        id: 2,
        name: "Mèo",
        image: "https://res.cloudinary.com/dvcpy4kmm/image/upload/v1749896905/cat_1_jjn3yb.jpg",
        sound: "Mèo kêu meo meo!",
        soundUrl: "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749898571/cat-meow-85175_bncs8u.mp3",
        color: "bg-pink-400",
    },
    {
        id: 3,
        name: "Voi",
        image: "https://res.cloudinary.com/dvcpy4kmm/image/upload/v1749896903/elephant_1_nick04.jpg",
        sound: "Voi rống lên!",
        soundUrl: "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749899065/elephant-trumpets-growls-6047_k7vpus.mp3",
        color: "bg-blue-400",
    },
    {
        id: 4,
        name: "Chim",
        image: "https://res.cloudinary.com/dvcpy4kmm/image/upload/v1749896904/bird_1_v0klgc.jpg",
        sound: "Chim kêu chiếp chiếp!",
        soundUrl: "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749899066/bird-chirp-86570_gyqlxf.mp3",
        color: "bg-orange-400",
    },
    {
        id: 5,
        name: "Bò",
        image: "https://res.cloudinary.com/dvcpy4kmm/image/upload/v1749896905/cow_1_ycp0ba.png",
        sound: "Bò kêu ò...moo!",
        soundUrl: "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749898723/cows-on-pasture_animal-sound-149489_v0vfpz.mp3",
        color: "bg-green-400",
    },
    {
        id: 6,
        name: "Ngựa",
        image: "https://res.cloudinary.com/dvcpy4kmm/image/upload/v1749896905/hourse_1_frxidq.jpg",
        sound: "Ngựa hí hí!",
        soundUrl: "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749899066/horse-neigh-261131_iwy13k.mp3",
        color: "bg-purple-400",
    },
    {
        id: 7,
        name: "Cừu",
        image: "https://res.cloudinary.com/dvcpy4kmm/image/upload/v1749896906/sheep_1_gmtios.jpg",
        sound: "Cừu kêu be be!",
        soundUrl: "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749899066/sheep-352668_rfivsb.mp3",
        color: "bg-red-400",
    },
    {
        id: 8,
        name: "Vịt",
        image: "https://res.cloudinary.com/dvcpy4kmm/image/upload/v1749896906/duck_1_myj9mx.jpg",
        sound: "Vịt kêu cạp cạp!",
        soundUrl: "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749899065/duck-quack-112941_tciihe.mp3",
        color: "bg-cyan-400",
    },
    {
        id: 9,
        name: "Heo",
        image: "https://res.cloudinary.com/dvcpy4kmm/image/upload/v1749896903/pig_1_qklggn.jpg",
        sound: "Heo kêu ụt ịt!",
        soundUrl: "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749899065/pig-oink-47167_saopls.mp3",
        color: "bg-indigo-400",
    },
    {
        id: 10,
        name: "Gà",
        image: "https://res.cloudinary.com/dvcpy4kmm/image/upload/v1749896906/chicken_1_yn9kow.jpg",
        sound: "Gà kêu cục tác!",
        soundUrl: "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749899066/chicken-46803_cgxnbl.mp3",
        color: "bg-teal-400",
    },
]

export default function LessonDetailPage() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const audioRef = useRef(new Audio())
    const navigate = useNavigate()
    const [hasAccess, setHasAccess] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const { user, isAuthenticated } = useAuthStore()
    const { completeLesson, getLessonProgress } = useLearningProgress()
    const [lessonStartTime] = useState(Date.now())
    
    const lessonInfo = {
        type: 'animal',
        id: '1',
        title: '10 Loại động vật quanh chúng ta',
        price: PaymentService.getLessonPrice('animal', '1')
    }

    // Track lesson completion
    const checkLessonCompletion = () => {
        const timeSpent = Math.round((Date.now() - lessonStartTime) / 1000)
        const score = Math.round((currentIndex + 1) / animals.length * 100)
        
        if (currentIndex === animals.length - 1) {
            // Completed all animals
            completeLesson('animal', '1', score, timeSpent)
            toast.success('🎉 Chúc mừng! Bạn đã hoàn thành bài học về động vật!')
        }
    }
    // Hàm dừng âm thanh
    const stopSound = () => {
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
    }

    const nextCard = () => {
        stopSound() // Dừng âm thanh trước khi chuyển
        const nextIndex = currentIndex < animals.length - 1 ? currentIndex + 1 : 0
        setCurrentIndex(nextIndex)
        
        // Check completion when reaching the last animal
        if (nextIndex === animals.length - 1) {
            setTimeout(checkLessonCompletion, 2000) // Delay to let user see the last animal
        }
    }

    const prevCard = () => {
        stopSound() // Dừng âm thanh trước khi chuyển
        setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : animals.length - 1)
    }

    const playSound = (sound, soundUrl) => {
        // Dừng âm thanh hiện tại nếu đang phát
        stopSound()

        // Nếu có URL âm thanh, phát âm thanh từ URL
        if (soundUrl) {
            audioRef.current.src = soundUrl
            audioRef.current.play().catch(error => {
                console.error("Error playing audio:", error)
                // Fallback to text-to-speech if audio fails
                const utterance = new SpeechSynthesisUtterance(sound)
                utterance.rate = 0.8
                utterance.pitch = 1.2
                speechSynthesis.speak(utterance)
            })
        } else {
            // Fallback to text-to-speech if no audio URL
            const utterance = new SpeechSynthesisUtterance(sound)
            utterance.rate = 0.8
            utterance.pitch = 1.2
            speechSynthesis.speak(utterance)
        }
    }

    // Check lesson access on component mount
    useEffect(() => {
        const checkAccess = async () => {
            if (!isAuthenticated) {
                setIsLoading(false)
                return
            }
            
            try {
                const accessData = await PaymentService.checkLessonAccess(lessonInfo.type, lessonInfo.id)
                setHasAccess(accessData.hasAccess)
            } catch (error) {
                console.error('Error checking access:', error)
                toast.error('Không thể kiểm tra quyền truy cập bài học')
            } finally {
                setIsLoading(false)
            }
        }
        
        checkAccess()
    }, [isAuthenticated])

    // Cleanup khi component unmount và track progress
    useEffect(() => {
        return () => {
            stopSound()
            // Save progress when leaving the lesson
            const timeSpent = Math.round((Date.now() - lessonStartTime) / 1000)
            const progressPercent = Math.round(((currentIndex + 1) / animals.length) * 100)
            
            // Save partial progress even if not completed
            if (timeSpent > 10) { // Only save if spent more than 10 seconds
                sessionStorage.setItem('animalLessonProgress', JSON.stringify({
                    currentIndex,
                    timeSpent,
                    progressPercent,
                    lastVisited: Date.now()
                }))
            }
        }
    }, [currentIndex, lessonStartTime])
    const handleNavigateBack = () => {
        navigate("/curriculum")
    }

    const handlePaymentSuccess = () => {
        setHasAccess(true)
        toast.success('Bạn đã có quyền truy cập vào bài học này!')
    }

    const handlePurchaseClick = () => {
        if (!isAuthenticated) {
            //toast.error('Vui lòng đăng nhập để mua bài học')
            return
        }
        setShowPaymentModal(true)
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="h-screen bg-gradient-to-br from-sky-100 via-purple-50 to-pink-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-purple-600 font-semibold">Đang kiểm tra quyền truy cập...</p>
                </div>
            </div>
        )
    }

    // Access denied state
    if (!isAuthenticated && !hasAccess) {
        return (
            <div className="h-screen bg-gradient-to-br from-sky-100 via-purple-50 to-pink-100">
                <button
                    onClick={handleNavigateBack}
                    className="fixed top-4 left-4 z-50 bg-white hover:bg-gray-100 text-purple-600 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 flex items-center gap-2"
                    aria-label="Trở về"
                >
                    <ArrowLeft size={24} />
                    <span className="font-semibold hidden sm:inline">Trở về</span>
                </button>

                <div className="max-w-4xl mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md w-full">
                        <div className="mb-6">
                            <Lock className="mx-auto text-purple-600 mb-4" size={64} />
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bài học cần thanh toán</h2>
                            <p className="text-gray-600 mb-4">
                                Để truy cập vào bài học `{lessonInfo.title}``, bạn cần thanh toán phí học tập.
                            </p>
                        </div>

                        <div className="bg-purple-50 rounded-2xl p-4 mb-6">
                            <h3 className="font-semibold text-purple-800 mb-2">{lessonInfo.title}</h3>
                            <div className="text-3xl font-bold text-purple-600 mb-2">
                                {PaymentService.formatPrice(lessonInfo.price)}
                            </div>
                            <div className="text-sm text-purple-600">
                                ✅ Truy cập không giới hạn trong 30 ngày<br/>
                                ✅ 10 loại động vật với âm thanh thật<br/>
                                ✅ Học liệu chất lượng cao
                            </div>
                        </div>

                        <button
                            onClick={handlePurchaseClick}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-colors font-semibold"
                        >
                            Mua bài học ngay
                        </button>
                    </div>
                </div>

                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    lesson={lessonInfo}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            </div>
        )
    }

    // Not authenticated state
    // if (!isAuthenticated) {
    //     toast.error('Vui lòng đăng nhập để mua bài học')
    //     return
    // }
    return (
        <div className="h-screen overflow-y-auto bg-gradient-to-br from-sky-100 via-purple-50 to-pink-100">
            <button
                onClick={handleNavigateBack}
                className="fixed top-4 left-4 z-50 bg-white hover:bg-gray-100 text-purple-600 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 flex items-center gap-2"
                aria-label="Trở về"
            >
                <ArrowLeft size={24} />
                <span className="font-semibold hidden sm:inline">Trở về</span>
            </button>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-purple-800 mb-4 font-comic">
                        🐾 Những Con Vật Quen Thuộc Quanh Ta 🐾
                    </h1>
                </div>

                {/* Progress Bar */}
                <div className="max-w-md mx-auto mb-6">
                    <div className="flex justify-between text-sm text-purple-600 mb-2">
                        <span>Tiến độ bài học</span>
                        <span>{Math.round(((currentIndex + 1) / animals.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-3">
                        <div 
                            className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${((currentIndex + 1) / animals.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-center items-center gap-8 mb-8">
                    <button
                        onClick={prevCard}
                        className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-xl transition-all duration-200 hover:scale-110"
                        aria-label="Con vật trước"
                    >
                        <ChevronLeft size={32} />
                    </button>

                    <div className="bg-white rounded-full px-6 py-3 shadow-lg">
                        <span className="text-purple-700 font-bold text-xl">
                            {currentIndex + 1} of {animals.length}
                        </span>
                    </div>

                    <button
                        onClick={nextCard}
                        className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-xl transition-all duration-200 hover:scale-110"
                        aria-label="Con vật kế tiếp"
                    >
                        <ChevronRight size={32} />
                    </button>
                </div>

                {/* Single Animal Card Display */}
                <div className="flex justify-center mb-8">
                    <div
                        className={`w-96 h-[500px] md:w-[500px] md:h-[600px] ${animals[currentIndex].color} rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105`}
                    >
                        <div className="p-8 md:p-12 h-full flex flex-col items-center justify-between">
                            {/* Animal Image */}
                            <div className="bg-white rounded-3xl p-8 shadow-lg mb-8 w-full flex items-center justify-center">
                                <img
                                    src={animals[currentIndex].image || "/placeholder.svg"}
                                    alt={animals[currentIndex].name}
                                    className="w-48 h-48 md:w-60 md:h-60 object-cover rounded-2xl"
                                />
                            </div>

                            {/* Animal Name */}
                            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center font-comic">
                                {animals[currentIndex].name}
                            </h3>

                            {/* Sound Description */}
                            <p className="text-white text-center text-xl md:text-2xl font-medium mb-8 leading-tight">
                                {animals[currentIndex].sound}
                            </p>

                            {/* Sound Button */}
                            <button
                                onClick={() => playSound(animals[currentIndex].sound, animals[currentIndex].soundUrl)}
                                className="bg-white hover:bg-gray-100 text-gray-700 px-8 py-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 flex items-center gap-4"
                                aria-label={`Play sound for ${animals[currentIndex].name}`}
                            >
                                <Volume2 size={28} />
                                <span className="font-semibold text-xl">Phát Âm Thanh</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center mt-8 gap-3">
                    {animals.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-4 h-4 rounded-full transition-all duration-200 ${
                                index === currentIndex ? "bg-purple-600 scale-125" : "bg-purple-300 hover:bg-purple-400"
                            }`}
                            aria-label={`Đi tới con vật số ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Fun Facts Section */}
                <div className="mt-12 bg-white rounded-3xl shadow-xl p-8 mb-8">
                    <h2 className="text-3xl font-bold text-purple-800 mb-6 text-center font-comic">
                        🌟 Sự Thật Thú Vị Về Động Vật! 🌟
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-yellow-100 rounded-2xl p-4">
                            <p className="text-gray-700 text-lg">
                                <span className="font-bold text-yellow-600">Bé có biết không?</span> Chó có thể nghe được những âm thanh mà tai người không thể!
                            </p>
                        </div>
                        <div className="bg-pink-100 rounded-2xl p-4">
                            <p className="text-gray-700 text-lg">
                                <span className="font-bold text-pink-600">Thật tuyệt vời!</span> Voi có thể nhớ bạn bè của chúng trong nhiều năm!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .font-comic {
          font-family: 'Comic Sans MS', cursive, sans-serif;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                lesson={lessonInfo}
                onPaymentSuccess={handlePaymentSuccess}
            />
        </div>
    )
}