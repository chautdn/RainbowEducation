"use client"

import { useState } from "react"

export default function AlphabetSelector({ selectedLetter, onSelectLetter }) {
    const [activeTab, setActiveTab] = useState("uppercase")

    const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
    const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz".split("")
    const vietnameseLetters = "ĂÂÊÔƠƯĐ".split("")

    const getLetters = () => {
        switch (activeTab) {
            case "uppercase":
                return uppercaseLetters
            case "lowercase":
                return lowercaseLetters
            case "vietnamese":
                return vietnameseLetters
            default:
                return uppercaseLetters
        }
    }

    return (
        <div>
            {/* Tabs */}
            <div className="flex space-x-2 mb-4">
                <button
                    onClick={() => setActiveTab("uppercase")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "uppercase"
                            ? "bg-purple-500 text-white"
                            : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        }`}
                >
                    Chữ hoa
                </button>
                <button
                    onClick={() => setActiveTab("lowercase")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "lowercase"
                            ? "bg-purple-500 text-white"
                            : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        }`}
                >
                    Chữ thường
                </button>
                <button
                    onClick={() => setActiveTab("vietnamese")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "vietnamese"
                            ? "bg-purple-500 text-white"
                            : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        }`}
                >
                    Chữ Việt
                </button>
            </div>

            {/* Letters grid */}
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2">
                {getLetters().map((letter) => (
                    <button
                        key={letter}
                        onClick={() => onSelectLetter(letter)}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold transition-all transform hover:scale-110 ${selectedLetter === letter
                                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-110"
                                : "bg-white text-purple-700 hover:bg-purple-50 border border-purple-200"
                            }`}
                    >
                        {letter}
                    </button>
                ))}
            </div>
        </div>
    )
}
