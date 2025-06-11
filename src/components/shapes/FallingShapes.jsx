import React, { useEffect, useState, useCallback, useMemo } from 'react';
import './styles.css';

const shapes = [
    { symbol: '🔵', name: 'Circle' },
    { symbol: '🟪', name: 'Square' },
    { symbol: '🚗', name: 'Triangle' },
    { symbol: '🏆', name: 'Rectangle' },
    { symbol: '🍒', name: 'Pentagon' },
    { symbol: '😮', name: 'Hexagon' },
    { symbol: '😜', name: 'Octagon' },
    { symbol: '🎁', name: 'Oval' },
    { symbol: '⬔', name: 'Trapezoid' },
    { symbol: '◆', name: 'Diamond' },
    { symbol: '★', name: 'Star' },
    { symbol: '✶', name: 'Snowflake' },
    { symbol: '♥', name: 'Heart' },
];

const FallingShapes = () => {
    const [fallingShapes, setFallingShapes] = useState([]);


    const memoizedShapes = useMemo(() => shapes, []);


    const generateShape = useCallback(() => {
        const randomShape = memoizedShapes[Math.floor(Math.random() * memoizedShapes.length)];
        const position = Math.random() * 100;
        const duration = Math.random() * 3 + 2;

        const newShape = {
            id: Math.random(),
            symbol: randomShape.symbol,
            left: position,
            duration: duration,
        };


        setFallingShapes((prev) => [...prev, newShape]);


        setTimeout(() => {
            setFallingShapes((prev) => prev.filter((shape) => shape.id !== newShape.id));
        }, duration * 1000);
    }, [memoizedShapes]);

    // Use effect to generate shapes on an interval
    useEffect(() => {
        const interval = setInterval(generateShape, 1000);

        return () => clearInterval(interval);
    }, [generateShape]);

    return (
        <div className="falling-shapes w-screen h-screen overflow-hidden pointer-events-none">
            {fallingShapes.map((shape) => (
                <div
                    key={shape.id}
                    className="falling-shape font-extrabold  text-4xl"
                    style={{
                        left: `${shape.left}vw`,
                        animationDuration: `${shape.duration}s`,
                    }}
                >
                    {shape.symbol}
                </div>
            ))}
        </div>
    );
};

export default FallingShapes;
