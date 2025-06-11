import { weeklyData } from "../../data/dashboardData"

export default function WeeklySummary() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">Tổng Kết Tuần</h2>
                    <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-sm text-gray-600">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        6 skills this week
                    </div>
                </div>
                <p className="text-sm text-gray-600">Theo dõi tiến độ học tập hàng tuần của con bạn</p>
            </div>

            <div className="px-6 pb-6">
                <div className="flex justify-between items-end">
                    {weeklyData.map((data, i) => (
                        <div key={i} className="text-center flex-1">
                            <div
                                className={`w-12 h-12 mx-auto mb-3 rounded-full border-2 flex items-center justify-center font-semibold ${data.completed
                                        ? "bg-green-100 border-green-500 text-green-700"
                                        : "bg-gray-100 border-gray-300 text-gray-400"
                                    }`}
                            >
                                {data.completed ? "✓" : i + 1}
                            </div>
                            <p className="text-xs font-medium text-gray-900">Tuần {i + 1}</p>
                            <p className="text-xs text-gray-500">
                                Thu nhập: <span className="font-medium">{data.earnings}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
