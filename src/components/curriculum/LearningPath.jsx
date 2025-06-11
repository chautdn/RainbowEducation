import React from 'react';

export default function LearningPath() {
    return (
        <div className="bg-white rounded-xl shadow-md p-4">
            <h2 className="font-bold text-lg">Lộ trình học tập</h2>
            <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <div className="flex gap-4 mt-4">
                {[1, 2].map((item) => (
                    <div key={item} className="bg-gray-100 rounded-xl p-4 flex-1">
                        <div className="text-xs bg-indigo-900 text-white inline-block px-2 py-1 rounded-md mb-2">Sắp học trong mục Toán học</div>
                        <div className="font-bold">Đếm số</div>
                        <div className="text-sm text-gray-500">Cùng đếm tới 3</div>
                        <div className="text-xs text-right mt-2">0/5 kỹ năng</div>
                    </div>
                ))}
            </div>
        </div>
    );
}