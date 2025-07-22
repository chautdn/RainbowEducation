import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function ParentDashboardMenu({ user }) {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const handleLogoClick = () => {
        navigate('/home');
    };

    const handleDashboardClick = () => {
        navigate('/parent-dashboard');
    };

    const handleCoursesClick = () => {
        navigate('/curriculum');
    };

    const handleProgressClick = () => {
        navigate('/parent-dashboard');
    };

    const handleSettingsClick = () => {
        navigate('/settings');
    };

    const handleLogoutClick = () => {
        logout();
        navigate('/login');
    };

    // Get user initials
    const getUserInitials = (name) => {
        if (!name) return "U";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const userInitials = getUserInitials(user?.name);

    return (
        <nav className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={handleLogoClick}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                    >
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                        </div>
                        <span className="font-bold text-xl text-gray-900">LearnHub</span>
                    </button>

                    <div className="hidden md:flex items-center gap-1">
                        <button 
                            onClick={handleDashboardClick}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            Dashboard
                        </button>
                        <button 
                            onClick={handleCoursesClick}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                            Courses
                        </button>
                        <button 
                            onClick={handleProgressClick}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                            Progress
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleSettingsClick}
                        className="p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        title="Settings"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 17h5l-5 5v-5zM4 19h10a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </button>
                    <button 
                        onClick={handleSettingsClick}
                        className="p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        title="Settings"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-700 font-semibold text-sm">{userInitials}</span>
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
