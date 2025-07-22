import { useState } from "react";

export default function ErrorNotification({ error, onRetry, onDismiss }) {
    const [isVisible, setIsVisible] = useState(true);

    if (!error || !isVisible) {
        return null;
    }

    const handleDismiss = () => {
        setIsVisible(false);
        if (onDismiss) onDismiss();
    };

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-red-800">
                        Có lỗi xảy ra
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                    </div>
                    <div className="mt-4 flex space-x-3">
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className="bg-red-100 text-red-800 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-red-200 transition-colors"
                            >
                                Thử lại
                            </button>
                        )}
                        <button
                            onClick={handleDismiss}
                            className="bg-red-100 text-red-800 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-red-200 transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
                <div className="ml-auto pl-3">
                    <button
                        onClick={handleDismiss}
                        className="inline-flex text-red-400 hover:text-red-600 transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
} 