import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderCode = searchParams.get('orderCode');
  
  useEffect(() => {
    // Clear any saved return URL since payment was cancelled
    sessionStorage.removeItem('courseReturnUrl');
  }, []);
  
  const handleRetryPayment = () => {
    // Go back to curriculum page where user can try payment again
    navigate('/curriculum');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="mb-6">
          <XCircle className="w-20 h-20 text-red-500 mx-auto" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Thanh toán bị hủy</h1>
        <p className="text-gray-600 mb-6">
          Bạn đã hủy giao dịch thanh toán. Không có khoản phí nào được tính.
        </p>
        
        {orderCode && (
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600">
              Mã đơn hàng: <span className="font-mono">{orderCode}</span>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <button
            onClick={handleRetryPayment}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} />
            Thử thanh toán lại
          </button>
          
          <button
            onClick={() => navigate('/curriculum')}
            className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Quay lại khóa học
          </button>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          Nếu bạn gặp vấn đề với thanh toán, vui lòng liên hệ hỗ trợ khách hàng.
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;