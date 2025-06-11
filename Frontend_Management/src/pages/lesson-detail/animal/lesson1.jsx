import { useState } from "react"
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react"

const animals = [
    {
        id: 1,
        name: "Dog",
        image: "/placeholder.svg?height=200&width=200",
        sound: "The dog says woof!",
        color: "bg-yellow-400",
    },
    {
        id: 2,
        name: "Cat",
        image: "/placeholder.svg?height=200&width=200",
        sound: "The cat says meow!",
        color: "bg-pink-400",
    },
    {
        id: 3,
        name: "Elephant",
        image: "/placeholder.svg?height=200&width=200",
        sound: "The elephant trumpets!",
        color: "bg-blue-400",
    },
    {
        id: 4,
        name: "Bird",
        image: "/placeholder.svg?height=200&width=200",
        sound: "The bird says tweet!",
        color: "bg-orange-400", 
    },
    {
        id: 5,
        name: "Cow",
        image: "/placeholder.svg?height=200&width=200",
        sound: "The cow says moo!",
        color: "bg-green-400",
    },
    {
        id: 6,
        name: "Horse",
        image: "/placeholder.svg?height=200&width=200",
        sound: "The horse says neigh!",
        color: "bg-purple-400",
    },
    {
        id: 7,
        name: "Sheep",
        image: "/placeholder.svg?height=200&width=200",
        sound: "The sheep says baa!",
        color: "bg-red-400",
    },
    {
        id: 8,
        name: "Duck",
        image: "/placeholder.svg?height=200&width=200",
        sound: "The duck says quack!",
        color: "bg-cyan-400",
    },
    {
        id: 9,
        name: "Pig",
        image: "/placeholder.svg?height=200&width=200",
        sound: "The pig says oink!",
        color: "bg-indigo-400",
    },
    {
        id: 10,
        name: "Chicken",
        image: "/placeholder.svg?height=200&width=200",
        sound: "The chicken says cluck!",
        color: "bg-teal-400",
    },
]

export default function LessonDetailPage() {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextCard = () => {
        setCurrentIndex(currentIndex < animals.length - 1 ? currentIndex + 1 : 0)
    }

    const prevCard = () => {
        setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : animals.length - 1)
    }

    const playSound = (sound) => {
        // In a real app, you could use text-to-speech or audio files
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(sound)
            utterance.rate = 0.8
            utterance.pitch = 1.2
            speechSynthesis.speak(utterance)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-50 to-pink-100 p-4 md:p-8">
            <style jsx>{`
                .font-comic {
                    font-family: 'Comic Sans MS', cursive, sans-serif;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-purple-800 mb-4 font-comic">
                        🐾 Familiar Animals Around Us 🐾
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
                        Let's learn about the amazing animals we see every day! Swipe through the cards to discover different
                        animals and the sounds they make. Tap the sound button to hear them speak!
                    </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-center items-center gap-8 mb-8">
                    <button
                        onClick={prevCard}
                        className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-xl transition-all duration-200 hover:scale-110"
                        aria-label="Previous animal"
                    >
                        <ChevronLeft size={32} />
                    </button>

                    <div className="bg-white rounded-full px-6 py-3 shadow-lg">
                        <span className="text-purple-700 font-bold text-xl">
                            {currentIndex + 1} of {animals.length}
                        </span>
                    </div>

                    <button
                        onClick={nextCard}
                        className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-xl transition-all duration-200 hover:scale-110"
                        aria-label="Next animal"
                    >
                        <ChevronRight size={32} />
                    </button>
                </div>

                {/* Single Animal Card Display */}
                <div className="flex justify-center mb-8">
                    <div
                        className={`w-80 h-96 ${animals[currentIndex].color} rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105`}
                    >
                        <div className="p-8 h-full flex flex-col items-center justify-between">
                            {/* Animal Image */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 w-full flex items-center justify-center">
                                <img
                                    src={animals[currentIndex].image || "/placeholder.svg"}
                                    alt={animals[currentIndex].name}
                                    className="w-40 h-40 object-cover rounded-xl"
                                />
                            </div>

                            {/* Animal Name */}
                            <h3 className="text-3xl font-bold text-white mb-4 text-center font-comic">
                                {animals[currentIndex].name}
                            </h3>

                            {/* Sound Description */}
                            <p className="text-white text-center text-xl font-medium mb-6 leading-tight">
                                {animals[currentIndex].sound}
                            </p>

                            {/* Sound Button */}
                            <button
                                onClick={() => playSound(animals[currentIndex].sound)}
                                className="bg-white hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 flex items-center gap-3"
                                aria-label={`Play sound for ${animals[currentIndex].name}`}
                            >
                                <Volume2 size={24} />
                                <span className="font-semibold text-lg">Play Sound</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center mt-8 gap-3">
                    {animals.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-4 h-4 rounded-full transition-all duration-200 ${index === currentIndex
                                    ? "bg-purple-600 scale-125"
                                    : "bg-purple-300 hover:bg-purple-400"
                                }`}
                            aria-label={`Go to animal ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Fun Facts Section */}
                <div className="mt-12 bg-white rounded-3xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-purple-800 mb-6 text-center font-comic">
                        🌟 Fun Animal Facts! 🌟
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-yellow-100 rounded-2xl p-4">
                            <p className="text-gray-700 text-lg">
                                <span className="font-bold text-yellow-600">Did you know?</span> Dogs can hear sounds that are too high
                                for humans to hear!
                            </p>
                        </div>
                        <div className="bg-pink-100 rounded-2xl p-4">
                            <p className="text-gray-700 text-lg">
                                <span className="font-bold text-pink-600">Amazing!</span> Elephants can remember their friends for many,
                                many years!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}