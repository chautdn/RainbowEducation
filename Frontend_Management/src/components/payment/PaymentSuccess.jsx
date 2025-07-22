import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader, XCircle } from 'lucide-react';
import { PaymentService } from '../../services/paymentService';
import CoursePaymentService from '../../services/coursePaymentService';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState(null);
  const [lessonInfo, setLessonInfo] = useState(null);
  
  useEffect(() => {
    const verifyPayment = async () => {
      const orderCode = searchParams.get('orderCode');
      
      if (!orderCode) {
        setStatus('error');
        setError('No order code found');
        return;
      }
      
      try {
        // Verify payment with backend
        const result = await CoursePaymentService.verifyPayment(orderCode);
        
        if (result.success && result.courseUnlocked) {
          setStatus('success');
          
          // Get lesson info from session storage if available
          const paymentReturnInfo = sessionStorage.getItem('paymentReturnInfo');
          const courseReturnInfo = sessionStorage.getItem('courseReturnUrl');
          
          let redirectInfo = null;
          
          if (paymentReturnInfo) {
            // This came from lesson payment
            redirectInfo = JSON.parse(paymentReturnInfo);
            sessionStorage.removeItem('paymentReturnInfo');
            
            setLessonInfo({
              title: redirectInfo.lessonTitle,
              type: redirectInfo.lessonType,
              id: redirectInfo.lessonId
            });
            
          } else if (courseReturnInfo) {
            // This came from course payment (curriculum page)
            redirectInfo = JSON.parse(courseReturnInfo);
            sessionStorage.removeItem('courseReturnUrl');
            
            setLessonInfo({
              title: result.course?.title || 'Course',
              type: redirectInfo.categoryType,
              id: redirectInfo.lessonId
            });
          } else {
            // Fallback - use course info from verification
            if (result.course) {
              setLessonInfo({
                title: result.course.title,
                type: result.course.category === 'animal' ? 'animal' : 'course',
                id: result.course.lessonId
              });
            }
          }
          
          // Redirect to appropriate lesson after 3 seconds
          setTimeout(() => {
            if (redirectInfo) {
              if (redirectInfo.lessonType === 'animal' || redirectInfo.category === 'animal') {
                navigate(`/lesson-detail/animal/lesson${redirectInfo.lessonId || redirectInfo.lessonId}`);
              } else if (redirectInfo.lessonType === 'math' || redirectInfo.categoryType === 'math') {
                navigate(`/lesson-detail/math/lesson${redirectInfo.lessonId || redirectInfo.lessonId}`);
              } else if (redirectInfo.lessonType === 'vietnamese' || redirectInfo.categoryType === 'vietnamese') {
                navigate(`/lesson-detail/vietnamese/lesson${redirectInfo.lessonId || redirectInfo.lessonId}`);
              } else {
                navigate('/curriculum');
              }
            } else if (result.course) {
              // Use course info for navigation
              if (result.course.category === 'animal') {
                navigate(`/lesson-detail/animal/lesson${result.course.lessonId}`);
              } else if (result.course.category === 'math') {
                navigate(`/lesson-detail/math/lesson${result.course.lessonId}`);
              } else {
                navigate(`/lesson-detail/vietnamese/lesson${result.course.lessonId}`);
              }
            } else {
              navigate('/curriculum');
            }
          }, 3000);
          
        } else {
          setStatus('error');
          setError(result.message || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setError(error.message);
      }
    };
    
    verifyPayment();
  }, [searchParams, navigate]);
  
  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Đang xác nhận thanh toán...</h2>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
          <div className="mt-4 text-sm text-gray-500">
            Đang liên hệ với PayOS để xác minh giao dịch
          </div>
        </div>
      </div>
    );
  }
  
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Lỗi thanh toán</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/curriculum')}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Quay lại khóa học
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const handleGoToLesson = () => {
    if (lessonInfo) {
      if (lessonInfo.type === 'animal') {
        navigate(`/lesson-detail/animal/lesson${lessonInfo.id}`);
      } else if (lessonInfo.type === 'math') {
        navigate(`/lesson-detail/math/lesson${lessonInfo.id}`);
      } else {
        navigate(`/lesson-detail/vietnamese/lesson${lessonInfo.id}`);
      }
    } else {
      navigate('/curriculum');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="mb-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-green-200 rounded-full animate-ping"></div>
            <CheckCircle className="w-20 h-20 text-green-500 relative" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Thanh toán thành công!</h1>
        
        {lessonInfo && (
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">{lessonInfo.title}</h3>
            <div className="text-sm text-gray-600">
              Loại: {lessonInfo.type === 'animal' ? 'Động vật' : 
                     lessonInfo.type === 'math' ? 'Toán học' : 'Tiếng Việt'}
            </div>
          </div>
        )}
        
        <p className="text-gray-600 mb-4">
          Bài học đã được mở khóa. Đang chuyển hướng...
        </p>
        
        <div className="space-y-3">
          <div className="bg-blue-100 border border-blue-300 text-blue-700 px-4 py-3 rounded-lg text-sm">
            <strong>Lưu ý:</strong> Bạn có quyền truy cập bài học này trong 30 ngày kể từ bây giờ.
          </div>
          
          <button
            onClick={handleGoToLesson}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đến bài học ngay
          </button>
          
          <button
            onClick={() => navigate('/curriculum')}
            className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Xem tất cả khóa học
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;