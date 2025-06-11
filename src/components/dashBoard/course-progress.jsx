"use client"

import LessonBlock from "./lesson-block"
import { topics, useExpandedLessons } from "../../data/dashboardData"

export default function CourseProgress() {
    const { expandedLessons, toggleLesson } = useExpandedLessons();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6">
                    <div className="p-6 pb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Course Topics</h3>
                    </div>
                    <div className="px-6 pb-6 space-y-4">
                        {topics.map((topic) => (
                            <div key={topic.id} className="space-y-2">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-0.5 text-blue-600">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h4 className="font-medium text-sm leading-tight mb-1 text-gray-900">{topic.title}</h4>
                                        <div className="space-y-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${(topic.progress / topic.totalSkills) * 100}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {topic.progress}/{topic.totalSkills} skills
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">{topics[0].title}</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {topics[0].progress}/{topics[0].totalSkills} skills completed
                                </p>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-sm text-gray-600">
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                    />
                                </svg>
                                Active Course
                            </div>
                        </div>
                    </div>
                    <div className="px-6 pb-6 space-y-6">
                        {topics[0].lessons.map((lesson, i) => (
                            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => toggleLesson(lesson.title)}
                                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                                        <span className="px-2 py-0.5 text-xs border border-gray-300 rounded-md bg-white">
                                            {lesson.skills}/{lesson.totalSkills} skills
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-md">Yet to start</span>
                                        <svg
                                            className={`h-4 w-4 transition-transform ${expandedLessons[lesson.title] ? "rotate-180" : ""}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>

                                {expandedLessons[lesson.title] && (
                                    <div className="p-4 space-y-4 bg-white">
                                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 px-4 py-2 bg-gray-50 rounded-md">
                                            <span>Learning Objective</span>
                                            <span className="text-center">Accuracy</span>
                                            <span className="text-center">Proficiency</span>
                                        </div>

                                        <div className="space-y-3">
                                            {lesson.items.map((item, j) => (
                                                <LessonBlock
                                                    key={j}
                                                    title={item.title}
                                                    letter={item.letter}
                                                    skills={item.skills}
                                                    totalSkills={item.totalSkills}
                                                    accuracy={item.accuracy}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
