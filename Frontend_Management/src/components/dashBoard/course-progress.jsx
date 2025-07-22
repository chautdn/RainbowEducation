"use client"

import { useMemo } from "react";
import LessonBlock from "./lesson-block";
import { topics, useExpandedLessons } from "../../data/dashboardData";

export default function CourseProgress({ progress }) {
    const { expandedLessons, toggleLesson } = useExpandedLessons();

    // Calculate real progress data from backend
    const realTopics = useMemo(() => {
        if (!progress || !Array.isArray(progress)) {
            return topics; // Fallback to static data
        }

        return topics.map(topic => {
            // Filter progress for this topic
            const topicProgress = progress.filter(p => {
                // Map topic titles to progress categories
                const topicMapping = {
                    "Identify Uppercase Letters": ["alphabet", "uppercase"],
                    "Trace Uppercase Letters": ["alphabet", "writing"],
                    "Identify Lowercase Letters": ["alphabet", "lowercase"],
                    "Trace Lowercase Letters": ["alphabet", "writing"],
                    "Alphabet Songs": ["alphabet", "songs"],
                    "Letter Sequence": ["alphabet", "sequence"],
                    "Sight Words": ["vietnamese", "words"],
                    "Books and Readers": ["vietnamese", "reading"]
                };

                const topicCategories = topicMapping[topic.title] || [];
                return topicCategories.some(cat => p.category === cat);
            });

            // Calculate progress for this topic
            const completedLessons = topicProgress.filter(p => p.completed).length;
            const totalLessons = topicProgress.length || topic.totalSkills;

            // Update lessons with real data
            const updatedLessons = topic.lessons?.map(lesson => {
                const lessonProgress = topicProgress.filter(p => {
                    // Map lesson titles to progress
                    const lessonMapping = {
                        "ABCD": ["A", "B", "C", "D"],
                        "EFG": ["E", "F", "G"],
                        "HIJK": ["H", "I", "J", "K"],
                        "LMNO": ["L", "M", "N", "O"],
                        "PQRS": ["P", "Q", "R", "S"],
                        "TUVW": ["T", "U", "V", "W"],
                        "XYZ": ["X", "Y", "Z"]
                    };

                    const lessonLetters = lessonMapping[lesson.title] || [];
                    return lessonLetters.some(letter => p.currentLetter === letter);
                });

                const lessonCompleted = lessonProgress.filter(p => p.completed).length;
                const lessonTotal = lessonProgress.length || lesson.totalSkills;

                // Update items with real data
                const updatedItems = lesson.items?.map(item => {
                    const itemProgress = lessonProgress.find(p => p.currentLetter === item.letter);
                    
                    return {
                        ...item,
                        skills: itemProgress ? (itemProgress.completed ? item.totalSkills : itemProgress.progress || 0) : 0,
                        accuracy: itemProgress ? itemProgress.bestScore || 0 : 0
                    };
                }) || [];

                return {
                    ...lesson,
                    skills: lessonCompleted,
                    totalSkills: lessonTotal,
                    items: updatedItems
                };
            }) || [];

            return {
                ...topic,
                progress: completedLessons,
                totalSkills: totalLessons,
                lessons: updatedLessons
            };
        });
    }, [progress]);

    // Get current active topic (first one with progress or first one)
    const activeTopic = useMemo(() => {
        return realTopics.find(topic => topic.progress > 0) || realTopics[0];
    }, [realTopics]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6">
                    <div className="p-6 pb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Course Topics</h3>
                    </div>
                    <div className="px-6 pb-6 space-y-4">
                        {realTopics.map((topic) => (
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
                                                    style={{ width: `${topic.totalSkills > 0 ? (topic.progress / topic.totalSkills) * 100 : 0}%` }}
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
                                <h2 className="text-xl font-semibold text-gray-900">{activeTopic?.title}</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {activeTopic?.progress}/{activeTopic?.totalSkills} skills completed
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
                        {activeTopic?.lessons?.map((lesson, i) => (
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
                                        <span className={`px-2 py-1 text-xs rounded-md ${
                                            lesson.skills === 0 ? "bg-gray-200 text-gray-600" :
                                            lesson.skills === lesson.totalSkills ? "bg-green-200 text-green-700" :
                                            "bg-yellow-200 text-yellow-700"
                                        }`}>
                                            {lesson.skills === 0 ? "Yet to start" :
                                             lesson.skills === lesson.totalSkills ? "Completed" :
                                             "In Progress"}
                                        </span>
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
                                            {lesson.items?.map((item, j) => (
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
