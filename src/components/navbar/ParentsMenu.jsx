import React from "react";
import { FaTimes, FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ParentsMenu = ({ onClose }) => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        onClose();
        navigate(path);
    };

    return (
        <div className="fixed top-0 left-0 w-full h-auto bg-[#2c2faa] z-50 text-white p-8">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-xl font-bold">
                    <FaUserShield />
                    <span>Phụ huynh</span>
                </div>
                <button onClick={onClose} className="text-2xl">
                    <FaTimes />
                </button>
            </div>

            <div className="mt-12 space-y-10 pl-4">
                <div onClick={() => handleNavigation("/settings")} className="cursor-pointer hover:opacity-80 transition-opacity">
                    <h3 className="text-xl font-semibold border-b border-white w-fit mb-1">Cài đặt →</h3>
                    <p className="text-gray-200">Thông tin phụ huynh, Quản lý đăng ký, Thông tin học viên</p>
                </div>
                <div onClick={() => handleNavigation("/parent-dashboard")} className="cursor-pointer hover:opacity-80 transition-opacity">
                    <h3 className="text-xl font-semibold border-b border-white w-fit mb-1">Báo cáo →</h3>
                    <p className="text-gray-200">Hoạt động học tập, Tiến độ chương trình</p>
                </div>
                <div onClick={() => handleNavigation("/help")} className="cursor-pointer hover:opacity-80 transition-opacity">
                    <h3 className="text-xl font-semibold border-b border-white w-fit mb-1">Trợ giúp →</h3>
                    <p className="text-gray-200">Hướng dẫn sử dụng, Câu hỏi thường gặp</p>
                </div>
            </div>
        </div>
    );
};

export default ParentsMenu;
