"use client"

import { useState } from "react"

export default function LessonBlock({ title, letter, skills, totalSkills, accuracy }) {
    const progressPercentage = totalSkills > 0 ? (skills / totalSkills) * 100 : 0;
    const accuracyPercentage = accuracy || 0;

    const getProgressColor = (percentage) => {
        if (percentage >= 80) return "bg-green-500";
        if (percentage >= 60) return "bg-yellow-500";
        if (percentage >= 40) return "bg-orange-500";
        return "bg-red-500";
    };

    const getAccuracyColor = (percentage) => {
        if (percentage >= 90) return "text-green-600";
        if (percentage >= 70) return "text-yellow-600";
        if (percentage >= 50) return "text-orange-600";
        return "text-red-600";
    };

    const getProficiencyLevel = (percentage) => {
        if (percentage >= 90) return "Expert";
        if (percentage >= 70) return "Advanced";
        if (percentage >= 50) return "Intermediate";
        if (percentage >= 30) return "Beginner";
        return "Novice";
    };

    return (
        <div className="grid grid-cols-3 gap-4 items-center py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-semibold text-sm">{letter || "?"}</span>
                </div>
                <div>
                    <h4 className="font-medium text-sm text-gray-900">{title}</h4>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                            className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(progressPercentage)}`}
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>
            
            <div className="text-center">
                <span className={`text-sm font-semibold ${getAccuracyColor(accuracyPercentage)}`}>
                    {accuracyPercentage}%
                </span>
            </div>
            
            <div className="text-center">
                <span className="text-xs text-gray-600">
                    {getProficiencyLevel(accuracyPercentage)}
                </span>
            </div>
        </div>
    );
}
