import React from 'react';

export default function Tabs({ onTabClick, activeTab }) {
  const tabList = [
    { key: "learning", label: "Lộ trình học tập" },
    { key: "math", label: "Chương trình toán học" },
    { key: "vietnamese", label: "Chương trình Tiếng Việt" },
  ];
  return (
    <div className="flex justify-center gap-4 py-4">
      {tabList.map(tab => (
        <button
          key={tab.key}
          className={`px-4 py-2 rounded-full transition-colors font-semibold
            ${activeTab === tab.key
              ? "bg-[#abf2e3] text-[#0a085f] shadow-lg border-2 border-[#7fffd4]"
              : "bg-gray-200 text-gray-700 hover:bg-blue-300"}
          `}
          onClick={() => onTabClick(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

