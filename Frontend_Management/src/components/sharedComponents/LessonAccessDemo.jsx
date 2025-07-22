import React, { useState, useEffect } from 'react';
import { PaymentService } from '../../services/paymentService';
import { toast } from 'react-toastify';
import { Lock, Crown, Check } from 'lucide-react';

const LessonAccessDemo = () => {
  const [userLessons, setUserLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserLessons();
  }, []);

  const loadUserLessons = async () => {
    try {
      const data = await PaymentService.getUserLessons();
      setUserLessons(data.lessons);
    } catch (error) {
      toast.error('Không thể tải danh sách bài học');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    loadUserLessons();
    toast.success('Thanh toán thành công!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-purple-800">
        Hệ thống Thanh toán Bài học
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userLessons.map((lesson) => (
          <div
            key={`${lesson.type}-${lesson.id}`}
            className={`bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl ${
              !lesson.hasAccess && !lesson.isFree ? 'ring-2 ring-yellow-400' : ''
            }`}
          >
            {/* Status Badge */}
            <div className="flex justify-between items-start mb-4">
              {lesson.hasAccess ? (
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Check size={16} />
                  Đã mở khóa
                </div>
              ) : lesson.isFree ? (
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Miễn phí
                </div>
              ) : (
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Crown size={16} />
                  Premium
                </div>
              )}

              {!lesson.hasAccess && !lesson.isFree && (
                <Lock className="text-gray-400" size={20} />
              )}
            </div>

            {/* Lesson Info */}
            <h3 className="font-bold text-lg mb-2 text-gray-800">
              {lesson.title}
            </h3>
            
            <div className="text-sm text-gray-600 mb-4">
              Loại: {lesson.type === 'vietnamese' ? 'Tiếng Việt' : 
                     lesson.type === 'math' ? 'Toán học' : 'Động vật'}
            </div>

            {/* Price */}
            {!lesson.isFree && (
              <div className="text-2xl font-bold text-purple-600 mb-4">
                {PaymentService.formatPrice(lesson.price)}
              </div>
            )}

            {/* Action Button */}
            {lesson.hasAccess ? (
              <button
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-semibold"
                disabled
              >
                ✅ Đã có quyền truy cập
              </button>
            ) : lesson.isFree ? (
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                onClick={() => window.open(`/lesson-detail/${lesson.type}/lesson${lesson.id}`, '_blank')}
              >
                Học ngay miễn phí
              </button>
            ) : (
              <button
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                onClick={() => handlePurchase(lesson)}
              >
                Mua bài học
              </button>
            )}
          </div>
        ))}
      </div>

      

      {/* Demo Instructions */}
      <div className="mt-12 bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Hướng dẫn Demo hệ thống thanh toán:
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li>✅ <strong>Bài học miễn phí:</strong> Vietnamese Lesson 1, Vietnamese Lesson 2, Math Lesson 4, Math Lesson 5</li>
          <li>💰 <strong>Bài học tính phí:</strong> Chỉ có Animal Lesson 1 (75.000 VND)</li>
          <li>🔒 <strong>Kiểm tra quyền truy cập:</strong> Tự động kiểm tra khi vào bài học</li>
          <li>💳 <strong>Thanh toán giả lập:</strong> 90% thành công, 10% thất bại để test</li>
          <li>⏰ <strong>Thời hạn:</strong> 30 ngày sau khi mua</li>
        </ul>
      </div>
    </div>
  );
};

export default LessonAccessDemo; 