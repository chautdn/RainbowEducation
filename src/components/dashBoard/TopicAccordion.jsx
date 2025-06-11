import { useState } from 'react';

export default function TopicAccordion({ topicNumber }) {
    const [open, setOpen] = useState(topicNumber === 1);

    const lessons = [
        { title: `Bài Học ${topicNumber * 3 - 2}`, skills: 5 },
        { title: `Bài Học ${topicNumber * 3 - 1}`, skills: 5 },
        { title: `Bài Học ${topicNumber * 3}`, skills: 5 }
    ];

    return (
        <div className="border rounded">
            <div
                className="bg-[#e9e8f5] px-4 py-2 font-medium cursor-pointer flex justify-between"
                onClick={() => setOpen(!open)}
            >
                <span>Chủ đề {topicNumber}</span>
                <span>{open ? '▲' : '▼'}</span>
            </div>
            {open && (
                <div className="bg-gray-100 px-4 py-2 space-y-2 text-sm">
                    {lessons.map((lesson, i) => (
                        <div key={i} className="flex justify-between items-center">
                            <div>
                                <p>{lesson.title}</p>
                                <p className="text-xs text-gray-500">{lesson.skills} kỹ năng</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="radio" />
                                <span>0%</span>
                                <button className="text-xs bg-white border px-2 py-1 rounded">Học</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
