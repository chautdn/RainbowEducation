import { useMemo } from "react";
import { weeklyData } from "../../data/dashboardData";

export default function WeeklySummary({ progress }) {
    // Calculate weekly summary from progress data
    const weeklySummary = useMemo(() => {
        if (!progress || !Array.isArray(progress)) {
            return weeklyData; // Fallback to static data
        }

        // Group progress by week (last 5 weeks)
        const now = new Date();
        const weeks = [];
        
        for (let i = 4; i >= 0; i--) {
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - (now.getDay() + 7 * i));
            weekStart.setHours(0, 0, 0, 0);
            
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            weekEnd.setHours(23, 59, 59, 999);

            // Count completed lessons in this week
            const weekProgress = progress.filter(p => {
                if (!p.lastStudiedAt) return false;
                const studyDate = new Date(p.lastStudiedAt);
                return studyDate >= weekStart && studyDate <= weekEnd && p.completed;
            });

            const earnings = weekProgress.length;
            const completed = earnings > 0;

            weeks.push({
                week: 5 - i,
                earnings,
                completed
            });
        }

        return weeks;
    }, [progress]);

    // Calculate total skills this week
    const skillsThisWeek = useMemo(() => {
        if (!progress || !Array.isArray(progress)) return 0;
        
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        return progress.filter(p => {
            if (!p.lastStudiedAt) return false;
            const studyDate = new Date(p.lastStudiedAt);
            return studyDate >= weekStart && studyDate <= weekEnd;
        }).length;
    }, [progress]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">Tổng Kết Tuần</h2>
                    <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-sm text-gray-600">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        {skillsThisWeek} skills this week
                    </div>
                </div>
                <p className="text-sm text-gray-600">Theo dõi tiến độ học tập hàng tuần của con bạn</p>
            </div>

            <div className="px-6 pb-6">
                <div className="flex justify-between items-end">
                    {weeklySummary.map((data, i) => (
                        <div key={i} className="text-center flex-1">
                            <div
                                className={`w-12 h-12 mx-auto mb-3 rounded-full border-2 flex items-center justify-center font-semibold ${data.completed
                                        ? "bg-green-100 border-green-500 text-green-700"
                                        : "bg-gray-100 border-gray-300 text-gray-400"
                                    }`}
                            >
                                {data.completed ? "✓" : i + 1}
                            </div>
                            <p className="text-xs font-medium text-gray-900">Tuần {i + 1}</p>
                            <p className="text-xs text-gray-500">
                                Thu nhập: <span className="font-medium">{data.earnings}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
