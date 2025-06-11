import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles.css';

const Button = () => {
    return (
        <div className="relative">
            <Link
                to="/game-lessons"
                className="mb-4 bg-yellow-500 hover:bg-yellow-600 text-white px-10 py-5 mt-6 inline-block rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
            >
                <span className="inline-block text-2xl">
                    Get started
                </span>
                <span className="orbiting-icon text-xl">
                    🚀
                </span>
            </Link>
        </div>
    );
};

export default Button;
