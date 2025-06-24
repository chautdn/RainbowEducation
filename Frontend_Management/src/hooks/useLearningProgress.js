import { useState, useEffect, useCallback } from 'react';

// Learning progress data structure
const INITIAL_PROGRESS = {
  vietnamese: {
    lessons: {
      '1': { completed: false, score: 0, timeSpent: 0, completedAt: null }, // Nhận biết chữ cái
      '2': { completed: false, score: 0, timeSpent: 0, completedAt: null }  // Tập viết chữ thường
    },
    totalLessons: 2,
    overallProgress: 0
  },
  math: {
    lessons: {
      '4': { completed: false, score: 0, timeSpent: 0, completedAt: null }, // Học viết số
      '5': { completed: false, score: 0, timeSpent: 0, completedAt: null }  // Học đọc số
    },
    totalLessons: 2,
    overallProgress: 0
  },
  animal: {
    lessons: {
      '1': { completed: false, score: 0, timeSpent: 0, completedAt: null, isPaid: false } // 10 Loại động vật
    },
    totalLessons: 1,
    overallProgress: 0
  },
  overall: {
    totalCompleted: 0,
    totalLessons: 5,
    overallProgress: 0,
    lastActiveDate: null,
    streakDays: 0
  }
};

const STORAGE_KEY = 'rainbow_education_progress';

export const useLearningProgress = () => {
  const [progress, setProgress] = useState(INITIAL_PROGRESS);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        setProgress(prevProgress => ({
          ...prevProgress,
          ...parsedProgress
        }));
      }
    } catch (error) {
      console.error('Error loading progress from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save progress to localStorage whenever it changes
  const saveProgress = useCallback((newProgress) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (error) {
      console.error('Error saving progress to localStorage:', error);
    }
  }, []);

  // Calculate overall progress for a subject
  const calculateSubjectProgress = useCallback((subjectData) => {
    const lessons = Object.values(subjectData.lessons);
    let totalProgress = 0;
    
    lessons.forEach(lesson => {
      if (lesson.completed) {
        totalProgress += 100; // Full completion = 100%
      } else if (lesson.progress && lesson.progress > 0) {
        totalProgress += lesson.progress; // Partial completion
      }
    });
    
    return Math.round(totalProgress / subjectData.totalLessons);
  }, []);

  // Update lesson progress
  const updateLessonProgress = useCallback((subject, lessonId, progressData) => {
    setProgress(prevProgress => {
      const updatedProgress = { ...prevProgress };
      
      // Update specific lesson
      updatedProgress[subject].lessons[lessonId] = {
        ...updatedProgress[subject].lessons[lessonId],
        ...progressData,
        completedAt: progressData.completed ? new Date().toISOString() : updatedProgress[subject].lessons[lessonId]?.completedAt
      };

      // Recalculate subject progress
      updatedProgress[subject].overallProgress = calculateSubjectProgress(updatedProgress[subject]);

      // Recalculate overall progress
      const totalCompleted = ['vietnamese', 'math', 'animal'].reduce((sum, subj) => {
        return sum + Object.values(updatedProgress[subj].lessons).filter(lesson => lesson.completed).length;
      }, 0);

      updatedProgress.overall = {
        ...updatedProgress.overall,
        totalCompleted,
        overallProgress: Math.round((totalCompleted / updatedProgress.overall.totalLessons) * 100),
        lastActiveDate: new Date().toISOString()
      };

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProgress));
      } catch (error) {
        console.error('Error saving progress:', error);
      }

      return updatedProgress;
    });
  }, [calculateSubjectProgress]);

  // Mark lesson as completed
  const completeLesson = useCallback((subject, lessonId, score = 100, timeSpent = 0) => {
    updateLessonProgress(subject, lessonId, {
      completed: true,
      score,
      timeSpent,
      completedAt: new Date().toISOString()
    });
  }, [updateLessonProgress]);

  // Start lesson (track start time)
  const startLesson = useCallback((subject, lessonId) => {
    const startTime = Date.now();
    
    return {
      // Return a function to call when lesson ends
      endLesson: (score = 100, completed = true) => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000); // in seconds
        updateLessonProgress(subject, lessonId, {
          completed,
          score,
          timeSpent,
          completedAt: completed ? new Date().toISOString() : null
        });
      }
    };
  }, [updateLessonProgress]);

  // Get progress for a specific lesson
  const getLessonProgress = useCallback((subject, lessonId) => {
    return progress[subject]?.lessons[lessonId] || { completed: false, score: 0, timeSpent: 0 };
  }, [progress]);

  // Get subject summary
  const getSubjectSummary = useCallback((subject) => {
    const subjectData = progress[subject];
    if (!subjectData) return null;

    const lessons = Object.entries(subjectData.lessons);
    const completedLessons = lessons.filter(([_, lesson]) => lesson.completed);
    const inProgressLessons = lessons.filter(([_, lesson]) => !lesson.completed && lesson.progress > 0);
    
    // Calculate average score including partial progress
    const allActiveScores = lessons
      .filter(([_, lesson]) => lesson.completed || lesson.score > 0)
      .map(([_, lesson]) => lesson.score || 0);
    
    const averageScore = allActiveScores.length > 0 
      ? Math.round(allActiveScores.reduce((sum, score) => sum + score, 0) / allActiveScores.length)
      : 0;
    
    const totalTimeSpent = lessons.reduce((sum, [_, lesson]) => sum + (lesson.timeSpent || 0), 0);

    return {
      totalLessons: subjectData.totalLessons,
      completedLessons: completedLessons.length,
      inProgressLessons: inProgressLessons.length,
      overallProgress: subjectData.overallProgress,
      averageScore,
      totalTimeSpent,
      nextLesson: lessons.find(([_, lesson]) => !lesson.completed)?.[0] || null,
      // Additional data for detailed view
      lessonsDetail: Object.fromEntries(lessons)
    };
  }, [progress]);

  // Reset progress (for testing or new user)
  const resetProgress = useCallback(() => {
    const resetData = { ...INITIAL_PROGRESS };
    saveProgress(resetData);
  }, [saveProgress]);

  // Get learning streak
  const getLearningStreak = useCallback(() => {
    // Simple streak calculation based on consecutive days
    // In a real app, you'd want more sophisticated logic
    return progress.overall.streakDays || 0;
  }, [progress]);

  // Get recommended next lesson
  const getRecommendedLesson = useCallback(() => {
    // Priority: Vietnamese -> Math -> Animal
    const subjects = ['vietnamese', 'math', 'animal'];
    
    for (const subject of subjects) {
      const nextLesson = Object.entries(progress[subject].lessons)
        .find(([_, lesson]) => !lesson.completed);
      
      if (nextLesson) {
        return {
          subject,
          lessonId: nextLesson[0],
          lessonData: nextLesson[1]
        };
      }
    }
    
    return null; // All lessons completed
  }, [progress]);

  return {
    progress,
    isLoading,
    updateLessonProgress,
    completeLesson,
    startLesson,
    getLessonProgress,
    getSubjectSummary,
    getRecommendedLesson,
    getLearningStreak,
    resetProgress,
    saveProgress
  };
}; 