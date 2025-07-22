import { useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PlayerSelector from "../../components/dashBoard/player-selector";
import WeeklySummary from "../../components/dashBoard/weekly-summary";
import CourseProgress from "../../components/dashBoard/course-progress";
import OverallStats from "../../components/dashBoard/overall-stats";
import ErrorNotification from "../../components/dashBoard/error-notification";
import ParentDashboardMenu from "../../components/navbar/ParentDashboardMenu";
import { useAuthStore } from "../../store/authStore";
import { useLearningProgress } from "../../hooks/useLearningProgress";

export const ParentDashboard = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isCheckingAuth, user, checkAuth } = useAuthStore();
    const { progress, isLoading: progressLoading, error, refetch } = useLearningProgress();
    const hasRedirected = useRef(false);
    const hasCheckedAuth = useRef(false);

    // Stabilize navigate function
    const stableNavigate = useCallback((path, options) => {
        navigate(path, options);
    }, [navigate]);

    // Check auth on mount (only once)
    useEffect(() => {
        if (!hasCheckedAuth.current) {
            hasCheckedAuth.current = true;
            checkAuth();
        }
    }, [checkAuth]);

    // Handle authentication redirect
    useEffect(() => {
        if (!isCheckingAuth && !isAuthenticated && !hasRedirected.current) {
            hasRedirected.current = true;
            stableNavigate("/login", { 
                state: { 
                    from: "/parent-dashboard",
                    message: "Vui lòng đăng nhập để truy cập dashboard phụ huynh" 
                } 
            });
        }
    }, [isAuthenticated, isCheckingAuth, stableNavigate]);

    // Reset redirect flag when auth state changes
    useEffect(() => {
        if (isAuthenticated) {
            hasRedirected.current = false;
        }
    }, [isAuthenticated]);

    // Show loading while checking auth
    if (isCheckingAuth || progressLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-purple-600 font-semibold">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    // Don't render if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                <ParentDashboardMenu user={user} />

                <ErrorNotification 
                    error={error} 
                    onRetry={refetch}
                />

                <div className="space-y-6">
                    <PlayerSelector user={user} />
                    <OverallStats progress={progress} />
                    <WeeklySummary progress={progress} />
                    <CourseProgress progress={progress} />
                </div>
            </div>
        </div>
    );
}