import React from 'react';

const StartGameButton = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <button
                // onClick={onStart}
                className="relative px-8 py-4 bg-gradient-to-r from-blue-400 via-pink-500 to-yellow-500 text-white text-4xl font-bold rounded-full shadow-lg transform transition-transform duration-500 hover:scale-110 hover:rotate-3 focus:outline-none"
            >
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-blue-400 opacity-50 rounded-full animate-pulse"></span>
                Start Game!
            </button>
        </div>
    );
};

export default StartGameButton;
