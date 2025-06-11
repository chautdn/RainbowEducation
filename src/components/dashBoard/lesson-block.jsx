"use client"

import { useState } from "react"

export default function LessonBlock({
    title = "Find the Letter",
    letter = "A",
    skills = 0,
    totalSkills = 4,
    accuracy = 0,
    isCompleted = false,
    isStarted = false,
}) {
    const [expanded, setExpanded] = useState(false)
    const progressPercentage = (skills / totalSkills) * 100

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                        {isCompleted ? (
                            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : isStarted ? (
                            <div className="h-5 w-5 rounded-full border-2 border-blue-500"></div>
                        ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                        )}
                    </div>

                    <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 truncate">
                                {title} {letter}
                            </h4>
                            {letter && (
                                <span className="px-2 py-0.5 text-xs border border-gray-300 rounded-md bg-gray-50">{letter}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="text-sm text-gray-500">
                                {skills}/{totalSkills} skills
                            </p>
                            <div className="flex-1 max-w-24 bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">{accuracy}%</span>
                        <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                            Preview
                        </button>
                    </div>
                </div>
            </div>

            {isStarted && expanded && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <div className="space-y-3">
                        {[...Array(totalSkills)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-3">
                                    <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            {title} {letter}
                                        </p>
                                        <p className="text-xs text-gray-500">0/1 skills</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">0%</span>
                                    <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                                    <button className="px-3 py-1 text-xs border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors">
                                        Preview
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
