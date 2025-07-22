import { FaArrowLeft } from "react-icons/fa";
import BackgroundStars from "../../components/BackgroundStars";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export const SettingsPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const handleGoBack = () => {
        navigate('/home');
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout fails, clear local storage and redirect
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    const handleMenuClick = (text) => {
        switch (text) {
            case "Đăng xuất":
                handleLogout();
                break;
            case "Thời Khóa Biểu":
                // Handle schedule
                break;
            case "Thông tin tài khoản":
                // Handle account info
                break;
            case "Cài đặt":
                // Handle settings
                break;
            case "Xóa tài khoản":
                // Handle delete account
                break;
            default:
                break;
        }
    };

    return (
        <div className="relative min-h-screen">
            <BackgroundStars />

            <div className="relative z-10 flex flex-col items-center py-8 px-6">
                {/* Header */}
                <div className="relative w-full max-w-xl text-center mb-8">
                    <button 
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400 transition-colors"
                        onClick={handleGoBack}
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-xl font-bold bg-gray-300 py-3 px-8 rounded-full inline-block">Cài Đặt</h1>
                </div>

                {/* Profile Card */}
                <div className="bg-gray-300 rounded-xl w-full max-w-xl p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-3">Thông tin người chơi</h2>
                    <p className="text-sm text-gray-700 mb-4">bấm vào ảnh đại diện nhân vật để chỉnh sửa thông tin</p>
                    <div className="flex flex-col items-center">
                        <img
                            src="/img/frog.png"
                            alt="Avatar"
                            className="h-32 mb-4"
                        />
                        <p className="text-lg font-semibold">Player 1</p>
                        <p className="text-base">Toán: cấp mầm non</p>
                        <p className="text-base">Trò chơi : cấp 1</p>
                    </div>
                </div>

                {/* Menu Buttons */}
                <div className="space-y-4 w-full max-w-xl">
                    {[
                        "Thời Khóa Biểu",
                        "Thông tin tài khoản",
                        "Cài đặt",
                        "Xóa tài khoản",
                        "Đăng xuất",
                    ].map((text) => (
                        <button
                            key={text}
                            className="w-full bg-gray-300 py-5 rounded-lg text-left px-6 text-base font-medium hover:bg-gray-400 transition-colors"
                            onClick={() => handleMenuClick(text)}
                        >
                            {text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
