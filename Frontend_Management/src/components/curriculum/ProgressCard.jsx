import PropTypes from 'prop-types';
import { CheckCircle, Clock, Trophy, Play, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ProgressCard = ({ 
  subject, 
  title, 
  icon, 
  color, 
  summary, 
  nextLesson, 
  isLoading,
  onStartLesson 
}) => {
  const navigate = useNavigate();
  const [showLockedModal, setShowLockedModal] = useState(false);

  if (isLoading) {
    return (
      <div className={`${color} rounded-xl p-6 animate-pulse`}>
        <div className="h-4 bg-white/30 rounded mb-4"></div>
        <div className="h-8 bg-white/30 rounded mb-2"></div>
        <div className="h-4 bg-white/30 rounded"></div>
      </div>
    );
  }

  const isAnimalLessonLocked = subject === 'animal' && nextLesson === '1';

  const handleStartLesson = () => {
    if (nextLesson) {
      if (isAnimalLessonLocked) {
        setShowLockedModal(true);
        return;
      }
      // Navigate to the next lesson for free lessons
      const lessonRoutes = {
        vietnamese: `/lesson-detail/vietnamese/lesson${nextLesson}`,
        math: `/lesson-detail/math/lesson${nextLesson}`,
        animal: `/lesson-detail/animal/lesson${nextLesson}`
      };
      onStartLesson?.(subject, nextLesson);
      navigate(lessonRoutes[subject]);
    }
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}p`;
    return `${Math.round(seconds / 3600)}h`;
  };

  const getSubjectTitle = () => {
    const titles = {
      vietnamese: 'Tiếng Việt',
      math: 'Toán học', 
      animal: 'Động vật'
    };
    return titles[subject] || title;
  };

  return (
    <div className={`${color} rounded-xl p-6 text-white relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute top-2 right-2 text-4xl opacity-20">{icon}</div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h3 className="font-bold text-lg">{getSubjectTitle()}</h3>
        </div>
        <div className="text-sm bg-white/20 px-2 py-1 rounded-full">
          {summary?.overallProgress || 0}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/20 rounded-full h-3 mb-4">
        <div 
          className="bg-white h-3 rounded-full transition-all duration-500"
          style={{ width: `${summary?.overallProgress || 0}%` }}
        ></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <CheckCircle size={16} />
          </div>
          <div className="text-sm font-bold">{summary?.completedLessons || 0}/{summary?.totalLessons || 0}</div>
          <div className="text-xs opacity-80">Hoàn thành</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Trophy size={16} />
          </div>
          <div className="text-sm font-bold">{summary?.averageScore || 0}%</div>
          <div className="text-xs opacity-80">Điểm TB</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Clock size={16} />
          </div>
          <div className="text-sm font-bold">
            {summary?.totalTimeSpent ? formatTime(summary.totalTimeSpent) : '0s'}
          </div>
          <div className="text-xs opacity-80">Thời gian</div>
        </div>
      </div>

      {/* In Progress Lessons Info */}
      {summary?.inProgressLessons > 0 && (
        <div className="mb-4 p-3 bg-white/10 rounded-lg">
          <div className="text-xs opacity-90 mb-1">📝 Đang học dở:</div>
          <div className="text-sm font-semibold">{summary.inProgressLessons} bài học</div>
        </div>
      )}

      {/* Next Lesson Action */}
      {nextLesson ? (
        <button
          onClick={handleStartLesson}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            isAnimalLessonLocked 
              ? 'bg-red-500/80 hover:bg-red-500 cursor-pointer' 
              : 'bg-white/20 hover:bg-white/30 hover:scale-105'
          }`}
        >
          {isAnimalLessonLocked ? (
            <>
              <Lock size={16} />
              <span>Cần thanh toán - Lesson {nextLesson}</span>
            </>
          ) : (
            <>
              <Play size={16} />
              <span>Tiếp tục - Lesson {nextLesson}</span>
            </>
          )}
        </button>
      ) : (
        <div className="w-full py-3 px-4 rounded-lg bg-green-500/20 text-center font-semibold">
          🎉 Hoàn thành tất cả!
        </div>
      )}

      {/* Locked Modal */}
      {showLockedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <Lock className="mx-auto text-purple-600 mb-4" size={48} />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Bài học cần thanh toán</h2>
            <p className="text-gray-600 mb-4">
              Bạn cần thanh toán để mở khóa bài học động vật này.
            </p>
            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={() => {
                  setShowLockedModal(false);
                  navigate('/lesson-detail/animal/lesson1');
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold shadow"
              >
                Nạp tiền để mở khóa
              </button>
              <button
                onClick={() => setShowLockedModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold shadow"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ProgressCard.propTypes = {
  subject: PropTypes.string.isRequired,
  title: PropTypes.string,
  icon: PropTypes.node,
  color: PropTypes.string,
  summary: PropTypes.shape({
    overallProgress: PropTypes.number,
    completedLessons: PropTypes.number,
    totalLessons: PropTypes.number,
    averageScore: PropTypes.number,
    totalTimeSpent: PropTypes.number,
    inProgressLessons: PropTypes.number,
  }),
  nextLesson: PropTypes.string,
  isLoading: PropTypes.bool,
  onStartLesson: PropTypes.func,
};

export default ProgressCard; 