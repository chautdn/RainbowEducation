import React, { useState } from 'react';
import SpeechUtils from '../../utils/SpeechUtils';
import ShapesAnimation from "../../components/sharedComponents/ShapesAnimation";

// Define shapes array
const shapes = [
    { symbol: '●', name: 'Circle' },
    { symbol: '■', name: 'Square' },
    { symbol: '▲', name: 'Triangle' },
    { symbol: '▬', name: 'Rectangle' },
    { symbol: '⬟', name: 'Pentagon' },
    { symbol: '⬢', name: 'Hexagon' },
    { symbol: '⯃', name: 'Octagon' },
    { symbol: '⬭', name: 'Oval' },
    { symbol: '⬔', name: 'Trapezoid' },
    { symbol: '◆', name: 'Diamond' },
    { symbol: '★', name: 'Star' },
    { symbol: '✶', name: 'Snowflake' },
    { symbol: '♥', name: 'Heart' },
    { symbol: '▱', name: 'Parallelogram' },

];

// ShapeRaceGame component
const ShapeRaceGame = () => {
    const [timerId, setTimerId] = useState(null);

    const handleMouseEnter = (name) => {
        // Set a timer to speak the shape name after 500ms
        const id = setTimeout(() => SpeechUtils.speak(name), 500);
        setTimerId(id);
    };

    const handleMouseLeave = () => {
        // Clear the timer if mouse leaves before 500ms
        if (timerId) {
            clearTimeout(timerId);
            setTimerId(null);
        }
    };

    return (
        <div className="text-center py-0 max-w-7xl mx-auto">
            <h1 className="text-[#01427a] text-5xl font-extrabold my-4 animate-pulse">
                Learn Shapes!
            </h1>
            <p className="text-lg my-4 font-medium text-gray-700">
                Welcome to the Shape Race Game! Let's learn about the shapes you'll see in the game.
            </p>
            <ShapesAnimation />


            <div className="flex justify-center flex-wrap gap-6 my-8">
                {shapes.map((shape, index) => (
                    <div
                        className=" border-2 border-[#00bcd4] rounded-xl p-3 w-auto h-40 flex flex-col items-center justify-center text-4xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out"
                        key={index}
                        onMouseEnter={() => handleMouseEnter(shape.name)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className="text-[6rem] mb-2">{shape.symbol}</div>
                        <div className="font-bold text-2xl text-[#01427a]">
                            {shape.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShapeRaceGame;
