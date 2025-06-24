import React from 'react';
import { useLearningProgress } from '../../hooks/useLearningProgress';
import ProgressCard from './ProgressCard';
import OverallProgress from './OverallProgress';
import { RefreshCw } from 'lucide-react';

export default function LearningPath() {
    const { 
        progress, 
        isLoading, 
        getSubjectSummary, 
        startLesson, 
        resetProgress 
    } = useLearningProgress();

    const subjects = [
        {
            key: 'vietnamese',
            title: 'Tiếng Việt',
            icon: '📝',
            color: 'bg-gradient-to-br from-pink-500 to-rose-600'
        },
        {
            key: 'math', 
            title: 'Toán học',
            icon: '🔢',
            color: 'bg-gradient-to-br from-green-500 to-emerald-600'
        },
        {
            key: 'animal',
            title: 'Động vật', 
            icon: '🐾',
            color: 'bg-gradient-to-br from-purple-500 to-violet-600'
        }
    ];

    const handleStartLesson = (subject, lessonId) => {
        // Track lesson start time
        startLesson(subject, lessonId);
        
        // Store tracker in sessionStorage for use in lesson pages
        sessionStorage.setItem('currentLessonTracker', JSON.stringify({
            subject,
            lessonId,
            startTime: Date.now()
        }));
    };

    const handleResetProgress = () => {
        if (window.confirm('Bạn có chắc muốn reset toàn bộ tiến độ học tập? Hành động này không thể hoàn tác.')) {
            resetProgress();
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with reset button */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="font-bold text-2xl text-gray-800">📚 Lộ trình học tập</h2>
                    <p className="text-gray-600 mt-1">Theo dõi tiến độ học tập và tiếp tục hành trình khám phá tri thức</p>
                </div>
                <button
                    onClick={handleResetProgress}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Reset tiến độ"
                >
                    <RefreshCw size={16} />
                    Reset
                </button>
            </div>

            {/* Overall Progress */}
            <OverallProgress progress={progress} isLoading={isLoading} />

            {/* Subject Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subjects.map((subject) => {
                    const summary = getSubjectSummary(subject.key);
                    const nextLesson = summary?.nextLesson;
                    
                    return (
                        <ProgressCard
                            key={subject.key}
                            subject={subject.key}
                            title={subject.title}
                            icon={subject.icon}
                            color={subject.color}
                            summary={summary}
                            nextLesson={nextLesson}
                            isLoading={isLoading}
                            onStartLesson={handleStartLesson}
                        />
                    );
                })}
            </div>

            {/* Quick Stats */}
            {!isLoading && (
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="font-bold text-lg mb-4">📊 Thống kê nhanh</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{progress.overall.totalCompleted}</div>
                            <div className="text-sm text-gray-600">Bài đã hoàn thành</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{progress.overall.overallProgress}%</div>
                            <div className="text-sm text-gray-600">Tiến độ tổng</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{progress.vietnamese.overallProgress}%</div>
                            <div className="text-sm text-gray-600">Tiếng Việt</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">{progress.math.overallProgress}%</div>
                            <div className="text-sm text-gray-600">Toán học</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}