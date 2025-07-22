import { useMemo } from "react";

export default function OverallStats({ progress }) {
    const stats = useMemo(() => {
        if (!progress || !Array.isArray(progress)) {
            return {
                totalLessons: 0,
                completedLessons: 0,
                totalTimeSpent: 0,
                averageScore: 0,
                totalAttempts: 0,
                completionRate: 0
            };
        }

        const totalLessons = progress.length;
        const completedLessons = progress.filter(p => p.completed).length;
        const totalTimeSpent = progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
        const totalScore = progress.reduce((sum, p) => sum + (p.bestScore || 0), 0);
        const totalAttempts = progress.reduce((sum, p) => sum + (p.totalAttempts || 0), 0);
        
        const averageScore = totalLessons > 0 ? Math.round(totalScore / totalLessons) : 0;
        const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        return {
            totalLessons,
            completedLessons,
            totalTimeSpent,
            averageScore,
            totalAttempts,
            completionRate
        };
    }, [progress]);

    const formatTime = (minutes) => {
        if (minutes < 60) return `${minutes} phút`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours} giờ ${remainingMinutes} phút`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Total Lessons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Tổng số bài học</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalLessons}</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Completed Lessons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Bài học đã hoàn thành</p>
                        <p className="text-2xl font-bold text-green-600">{stats.completedLessons}</p>
                        <p className="text-sm text-gray-500">{stats.completionRate}% hoàn thành</p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Total Time Spent */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Tổng thời gian học</p>
                        <p className="text-2xl font-bold text-purple-600">{formatTime(stats.totalTimeSpent)}</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Average Score */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Điểm trung bình</p>
                        <p className="text-2xl font-bold text-orange-600">{stats.averageScore}%</p>
                    </div>
                    <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Total Attempts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Tổng số lần thử</p>
                        <p className="text-2xl font-bold text-red-600">{stats.totalAttempts}</p>
                    </div>
                    <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Learning Streak */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Chuỗi học tập</p>
                        <p className="text-2xl font-bold text-indigo-600">7 ngày</p>
                        <p className="text-sm text-gray-500">Đang duy trì</p>
                    </div>
                    <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
} 