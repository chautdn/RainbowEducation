import React from "react";
import { useNavigate } from "react-router-dom";

const dummyGames = [
    { title: "Memory Match", tag: "Memory", path: "/shuffleGame" },
    { title: "Chef Yum Yum", tag: "Cooking" },
    { title: "Garage Master", tag: "Construction" },
    { title: "The Coloring Adventure", tag: "Coloring" },
    { title: "Let's Dance", tag: "Dancing" },
    { title: "Pixel Party", tag: "Color & Learn" },
    { title: "Band Jam", tag: "Music" },
    { title: "The Dancing Jungle", tag: "Decoration" },
];

export default function GameCategorySection({ title }) {
    const navigate = useNavigate();

    const handleGameClick = (game) => {
        if (game.path) {
            navigate(game.path);
        }
    };

    return (
        <div className="rounded-3xl bg-[#1c1c69] shadow-lg p-6 font-sans">
            {/* Title */}
            <h2 className="text-white text-2xl font-extrabold mb-6 uppercase tracking-wide">
                {title}
            </h2>

            {/* Game grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {dummyGames.map((game, i) => (
                    <div
                        key={i}
                        onClick={() => handleGameClick(game)}
                        className="bg-[#0a0a3f] text-white rounded-xl p-3 transition hover:brightness-110 flex flex-col cursor-pointer"
                    >
                        <div className="h-28 md:h-32 rounded-md mb-3 overflow-hidden bg-[#ccc]">
                            {/* Placeholder hình ảnh, bạn có thể thay bằng <img src={game.image} /> nếu có */}
                            <div className="w-full h-full bg-gradient-to-tr from-pink-300 to-yellow-300" />
                        </div>
                        <div className="font-semibold text-sm md:text-base mb-1">{game.title}</div>
                        <div className="text-[12px] bg-white/10 px-2 py-1 w-fit rounded-full text-gray-200 font-medium">
                            {game.tag}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
