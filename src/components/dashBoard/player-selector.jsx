"use client"

import { gradeOptions, playerData, usePlayerSelector } from "../../data/dashboardData"

export default function PlayerSelector() {
  const { selectedGrade, setSelectedGrade } = usePlayerSelector();

  return (
    <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-full bg-${playerData.avatarColor}-100 flex items-center justify-center`}>
          <span className={`text-${playerData.avatarColor}-700 font-semibold text-sm`}>{playerData.initials}</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{playerData.name}</h3>
          <p className="text-sm text-gray-500">{playerData.status}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {gradeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Cài đặt
        </button>

        <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
            />
          </svg>
          Trò chơi
        </button>
      </div>
    </div>
  )
}
