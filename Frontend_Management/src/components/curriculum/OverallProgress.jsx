
import { Target, Flame, Calendar, Award } from 'lucide-react';
import PropTypes from 'prop-types';

const OverallProgress = ({ progress, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white animate-pulse">
        <div className="h-6 bg-white/30 rounded mb-4"></div>
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="text-center">
              <div className="h-8 bg-white/30 rounded mb-2"></div>
              <div className="h-4 bg-white/30 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa bắt đầu';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getMotivationalMessage = (progress) => {
    if (progress >= 100) return "🎉 Xuất sắc! Bạn đã hoàn thành tất cả!";
    if (progress >= 75) return "🌟 Rất tốt! Sắp hoàn thành rồi!";
    if (progress >= 50) return "💪 Tuyệt vời! Đã hoàn thành hơn một nửa!";
    if (progress >= 25) return "🚀 Tiếp tục cố gắng! Bạn đang làm rất tốt!";
    return "🌱 Hãy bắt đầu hành trình học tập thú vị!";
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 text-8xl opacity-10">🎓</div>
      <div className="absolute -bottom-5 -left-5 text-6xl opacity-10">📚</div>
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Tổng quan tiến độ học tập</h2>
        <p className="text-sm opacity-90">
          {getMotivationalMessage(progress.overall.overallProgress)}
        </p>
      </div>

      {/* Main Progress Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-white/20"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-white"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${progress.overall.overallProgress}, 100`}
              strokeLinecap="round"
              fill="transparent"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold">{progress.overall.overallProgress}%</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-6 h-6" />
          </div>
          <div className="text-lg font-bold">{progress.overall.totalCompleted}</div>
          <div className="text-xs opacity-80">Bài hoàn thành</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Award className="w-6 h-6" />
          </div>
          <div className="text-lg font-bold">{progress.overall.totalLessons}</div>
          <div className="text-xs opacity-80">Tổng bài học</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Flame className="w-6 h-6" />
          </div>
          <div className="text-lg font-bold">{progress.overall.streakDays}</div>
          <div className="text-xs opacity-80">Streak ngày</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="text-xs font-bold">
            {formatDate(progress.overall.lastActiveDate)}
          </div>
          <div className="text-xs opacity-80">Lần cuối</div>
        </div>
      </div>

      {/* Progress breakdown */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <h3 className="text-sm font-semibold mb-3">Chi tiết theo môn:</h3>
        <div className="space-y-2">
          {[
            { key: 'vietnamese', name: 'Tiếng Việt', icon: '📝' },
            { key: 'math', name: 'Toán học', icon: '🔢' },
            { key: 'animal', name: 'Động vật', icon: '🐾' }
          ].map(({ key, name, icon }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">{icon}</span>
                <span className="text-sm">{name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress[key].overallProgress}%` }}
                  ></div>
                </div>
                <span className="text-xs w-8 text-right">{progress[key].overallProgress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
OverallProgress.propTypes = {
  progress: PropTypes.shape({
    overall: PropTypes.shape({
      overallProgress: PropTypes.number,
      totalCompleted: PropTypes.number,
      totalLessons: PropTypes.number,
      streakDays: PropTypes.number,
      lastActiveDate: PropTypes.string,
    }),
    vietnamese: PropTypes.shape({
      overallProgress: PropTypes.number,
    }),
    math: PropTypes.shape({
      overallProgress: PropTypes.number,
    }),
    animal: PropTypes.shape({
      overallProgress: PropTypes.number,
    }),
  }).isRequired,
  isLoading: PropTypes.bool,
};
export default OverallProgress; 