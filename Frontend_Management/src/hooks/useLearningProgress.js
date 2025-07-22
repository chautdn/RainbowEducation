import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../components/utils/AxiosInstance';

export const useLearningProgress = () => {
    const [progress, setProgress] = useState({
        overall: {
            totalCompleted: 0,
            overallProgress: 0
        },
        vietnamese: {
            completed: 0,
            total: 10,
            overallProgress: 0,
            nextLesson: 1
        },
        math: {
            completed: 0,
            total: 10,
            overallProgress: 0,
            nextLesson: 1
        },
        animal: {
            completed: 0,
            total: 10,
            overallProgress: 0,
            nextLesson: 1
        }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, user } = useAuthStore();

    const fetchProgress = async () => {
        if (!isAuthenticated || !user) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            
            const response = await axiosInstance.get('/user/lesson-progress');
            
            if (response.data.success) {
                const progressData = response.data.data || [];
                
                // Calculate progress for each subject
                const vietnameseProgress = progressData.filter(p => p.subject === 'vietnamese');
                const mathProgress = progressData.filter(p => p.subject === 'math');
                const animalProgress = progressData.filter(p => p.subject === 'animal');
                
                const totalCompleted = progressData.filter(p => p.completed).length;
                const overallProgress = progressData.length > 0 ? Math.round((totalCompleted / progressData.length) * 100) : 0;
                
                setProgress({
                    overall: {
                        totalCompleted,
                        overallProgress
                    },
                    vietnamese: {
                        completed: vietnameseProgress.filter(p => p.completed).length,
                        total: 10,
                        overallProgress: vietnameseProgress.length > 0 ? Math.round((vietnameseProgress.filter(p => p.completed).length / vietnameseProgress.length) * 100) : 0,
                        nextLesson: vietnameseProgress.length > 0 ? Math.max(...vietnameseProgress.map(p => p.lessonId)) + 1 : 1
                    },
                    math: {
                        completed: mathProgress.filter(p => p.completed).length,
                        total: 10,
                        overallProgress: mathProgress.length > 0 ? Math.round((mathProgress.filter(p => p.completed).length / mathProgress.length) * 100) : 0,
                        nextLesson: mathProgress.length > 0 ? Math.max(...mathProgress.map(p => p.lessonId)) + 1 : 1
                    },
                    animal: {
                        completed: animalProgress.filter(p => p.completed).length,
                        total: 10,
                        overallProgress: animalProgress.length > 0 ? Math.round((animalProgress.filter(p => p.completed).length / animalProgress.length) * 100) : 0,
                        nextLesson: animalProgress.length > 0 ? Math.max(...animalProgress.map(p => p.lessonId)) + 1 : 1
                    }
                });
            } else {
                setError(response.data.message || 'Không thể tải dữ liệu tiến độ');
            }
        } catch (err) {
            console.error('Error fetching learning progress:', err);
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
            
            // Fallback to localStorage if API fails
            try {
                const localProgress = localStorage.getItem('learningProgress');
                if (localProgress) {
                    const parsed = JSON.parse(localProgress);
                    setProgress(parsed);
                }
            } catch (localErr) {
                console.error('Error reading from localStorage:', localErr);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const updateProgress = async (lessonId, progressData) => {
        if (!isAuthenticated || !user) {
            return false;
        }

        try {
            setError(null);
            
            const response = await axiosInstance.post('/user/lessons', {
                lessonId,
                ...progressData
            });

            if (response.data.success) {
                // Update local state
                setProgress(prev => {
                    const updated = { ...prev };
                    
                    // Update specific subject progress
                    if (progressData.subject) {
                        const subjectKey = progressData.subject;
                        if (updated[subjectKey]) {
                            updated[subjectKey] = {
                                ...updated[subjectKey],
                                completed: progressData.completed ? updated[subjectKey].completed + 1 : updated[subjectKey].completed,
                                overallProgress: Math.round(((updated[subjectKey].completed + (progressData.completed ? 1 : 0)) / updated[subjectKey].total) * 100)
                            };
                        }
                    }
                    
                    // Update overall progress
                    const totalCompleted = Object.keys(updated).filter(key => key !== 'overall').reduce((sum, key) => sum + updated[key].completed, 0);
                    const totalLessons = Object.keys(updated).filter(key => key !== 'overall').reduce((sum, key) => sum + updated[key].total, 0);
                    updated.overall = {
                        totalCompleted,
                        overallProgress: totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0
                    };
                    
                    // Also update localStorage as backup
                    try {
                        localStorage.setItem('learningProgress', JSON.stringify(updated));
                    } catch (err) {
                        console.error('Error updating localStorage:', err);
                    }
                    
                    return updated;
                });
                
                return true;
            } else {
                setError(response.data.message || 'Không thể cập nhật tiến độ');
                return false;
            }
        } catch (err) {
            console.error('Error updating learning progress:', err);
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật tiến độ');
            
            // Fallback to localStorage only
            try {
                setProgress(prev => {
                    const updated = { ...prev };
                    
                    if (progressData.subject) {
                        const subjectKey = progressData.subject;
                        if (updated[subjectKey]) {
                            updated[subjectKey] = {
                                ...updated[subjectKey],
                                completed: progressData.completed ? updated[subjectKey].completed + 1 : updated[subjectKey].completed,
                                overallProgress: Math.round(((updated[subjectKey].completed + (progressData.completed ? 1 : 0)) / updated[subjectKey].total) * 100)
                            };
                        }
                    }
                    
                    localStorage.setItem('learningProgress', JSON.stringify(updated));
                    return updated;
                });
                return true;
            } catch (localErr) {
                console.error('Error updating localStorage:', localErr);
                return false;
            }
        }
    };

    const startLesson = (subject, lessonId) => {
        // This function can be used to track when a lesson starts
        console.log(`Starting lesson ${lessonId} for subject ${subject}`);
        
        // You can add additional logic here like:
        // - Tracking lesson start time
        // - Updating analytics
        // - Setting session data
    };

    const getSubjectSummary = (subjectKey) => {
        const subjectProgress = progress[subjectKey];
        if (!subjectProgress) {
            return {
                completed: 0,
                total: 10,
                overallProgress: 0,
                nextLesson: 1
            };
        }
        
        return {
            ...subjectProgress,
            nextLesson: subjectProgress.nextLesson || 1
        };
    };

    const resetProgress = async () => {
        try {
            setProgress({
                overall: {
                    totalCompleted: 0,
                    overallProgress: 0
                },
                vietnamese: {
                    completed: 0,
                    total: 10,
                    overallProgress: 0,
                    nextLesson: 1
                },
                math: {
                    completed: 0,
                    total: 10,
                    overallProgress: 0,
                    nextLesson: 1
                },
                animal: {
                    completed: 0,
                    total: 10,
                    overallProgress: 0,
                    nextLesson: 1
                }
            });
            localStorage.removeItem('learningProgress');
            setError(null);
        } catch (err) {
            console.error('Error resetting progress:', err);
            setError('Không thể reset tiến độ');
        }
    };

    // Fetch progress on mount and when auth changes
    useEffect(() => {
        fetchProgress();
    }, [isAuthenticated, user]);

    return {
        progress,
        isLoading,
        error,
        updateProgress,
        resetProgress,
        startLesson,
        getSubjectSummary,
        refetch: fetchProgress
    };
}; 