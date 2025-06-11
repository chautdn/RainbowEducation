
import React, { useState } from 'react';

const LearnCounting = () => {
    const [clickedNumbers, setClickedNumbers] = useState([]);

    // Function to handle number click
    const handleNumberClick = (number) => {
        if (!clickedNumbers.includes(number)) {
            setClickedNumbers([...clickedNumbers, number]);
        }
    };

    // Render numbers from 1 to 100
    const renderNumbers = () => {
        const numbers = [];
        for (let i = 1; i <= 100; i++) {
            numbers.push(
                <div
                    key={i}
                    className={`w-16 h-16 flex items-center justify-center font-bold text-2xl rounded-lg shadow-md cursor-pointer transition-all duration-300 ${clickedNumbers.includes(i)
                        ? 'bg-yellow-400 text-white scale-125 rotate-12'
                        : 'bg-white text-blue-700 hover:bg-blue-400 hover:text-white'
                        }`}
                    onClick={() => handleNumberClick(i)}
                >
                    {i}
                </div>
            );
        }
        return numbers;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300">
            <h1 className="text-5xl font-extrabold text-white mb-8 animate-pulse">Let’s Count to 100!</h1>

            {/* Grid of numbers */}
            <div className="grid grid-cols-12 gap-4 max-w-7xl mx-auto ">
                {renderNumbers()}
            </div>
        </div>
    );
};

export default LearnCounting;

