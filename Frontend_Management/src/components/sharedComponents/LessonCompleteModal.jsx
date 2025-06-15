import { Home, Clock, Star, ArrowRight } from "lucide-react"; // Hoặc import từ react-icons nếu dùng
import { useNavigate } from "react-router-dom";

export default function LessonCompleteModal({ onClose, onContinuePath = "/lesson-detail/vietnamese/lesson2" }) {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-yellow-100 via-pink-50 to-purple-100 rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-white relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-2 left-2 text-2xl animate-bounce">🌟</div>
                <div className="absolute top-2 right-2 text-2xl animate-pulse">🎈</div>
                <div className="absolute bottom-2 left-2 text-xl animate-bounce delay-300">✨</div>
                <div className="absolute bottom-2 right-2 text-xl animate-pulse delay-500">🎊</div>

                {/* Main content */}
                <div className="text-center relative z-10">
                    <div className="text-6xl mb-4 animate-bounce">🎉</div>
                    <h2 className="text-2xl font-bold text-purple-800 mb-3 leading-tight">
                        Xuất sắc! Bạn đã hoàn thành tất cả chữ cái!
                    </h2>
                    <p className="text-lg text-purple-600 mb-6 font-medium">
                        Bạn có muốn tiếp tục với bài học viết chữ thường không?
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => {
                                onClose();
                                navigate(onContinuePath);
                            }}
                            className="bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                        >
                            <ArrowRight className="w-5 h-5" />
                            Tiếp tục học
                            <Star className="w-5 h-5 text-yellow-200" />
                        </button>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    onClose();
                                    navigate("/curriculum");
                                }}
                                className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-4 py-3 rounded-2xl font-bold hover:from-blue-500 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 flex-1"
                            >
                                <Home className="w-4 h-4" />
                                Về trang chủ
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-4 py-3 rounded-2xl font-bold hover:from-orange-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 flex-1"
                            >
                                <Clock className="w-4 h-4" />
                                Để sau
                            </button>
                        </div>
                    </div>
                </div>

                {/* Floating stars animation */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 text-yellow-400 animate-ping">⭐</div>
                    <div className="absolute top-3/4 right-1/4 text-pink-400 animate-ping delay-700">💫</div>
                    <div className="absolute top-1/2 left-1/6 text-blue-400 animate-ping delay-1000">✨</div>
                </div>
            </div>
        </div>
    );
}
