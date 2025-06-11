import React, { useEffect, useState, useCallback } from 'react';
import '../../assets/styles.css';

const FallingNumbers = () => {
    const [numbers, setNumbers] = useState([]);
    const generateNumber = useCallback(() => {
        const number = Math.floor(Math.random() * 100);
        const position = Math.random() * 100;
        const duration = Math.random() * 3 + 2;

        const newNumber = {
            id: Math.random(),
            value: number,
            left: position,
            duration: duration,
        };
        setNumbers((prev) => [...prev, newNumber]);

        setTimeout(() => {
            setNumbers((prev) => prev.filter(n => n.id !== newNumber.id));
        }, duration * 1000);
    }, []);


    useEffect(() => {
        const interval = setInterval(generateNumber, 1000);
        return () => clearInterval(interval);
    }, [generateNumber]);

    return (
        <div className="overflow-hidden  w-full">
            {numbers.map((number) => (
                <div
                    key={number.id}
                    className="falling-number font-extrabold  text-3xl"
                    style={{
                        left: `${number.left}vw`,
                        animationDuration: `${number.duration}s`,
                    }}
                >
                    {number.value}
                </div>
            ))}
        </div>
    );
};

export default FallingNumbers;
