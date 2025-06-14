import { letterGroups } from "../../data/courseData";

// Trong phần render của component, thay thế phần hiển thị lesson1 bằng:
{/* Vietnamese Category */}
<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
    <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tiếng Việt</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {letterGroups.map((group, index) => (
                <div
                    key={group.id}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/lesson-detail/vietnamese/group${index + 1}`)}
                >
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-purple-800">{group.name}</h3>
                        <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                            {group.letters.length} chữ
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{group.description}</p>
                    <div className="flex flex-wrap gap-2">
                        {group.letters.map((letter) => (
                            <span
                                key={letter}
                                className="bg-white text-purple-600 px-2 py-1 rounded-lg text-sm font-medium shadow-sm"
                            >
                                {letter}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
</div> 