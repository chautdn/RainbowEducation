import { useState } from 'react';
import { Target, BookOpen, Award } from 'lucide-react';

export const useExpandedLessons = () => {
    const [expandedLessons, setExpandedLessons] = useState({
        ABCD: true,
        EFG: true,
        HIJK: false,
        LMNO: false,
        PQRS: false,
        TUVW: false,
        XYZ: false,
    });

    const toggleLesson = (lessonTitle) => {
        setExpandedLessons((prev) => ({
            ...prev,
            [lessonTitle]: !prev[lessonTitle],
        }));
    };

    return { expandedLessons, toggleLesson };
};

// Player and Grade Data
export const usePlayerSelector = () => {
    const [selectedGrade, setSelectedGrade] = useState("grade2");
    
    return { selectedGrade, setSelectedGrade };
};

export const gradeOptions = [
    { value: "grade2", label: "Lớp 2 tuổi" },
    { value: "grade3", label: "Lớp 3 tuổi" },
];

export const playerData = {
    id: "player1",
    name: "Player1",
    status: "Active learner",
    initials: "P1",
    avatarColor: "green"
};

// Weekly Summary Data
export const weeklyData = [
    { week: 1, earnings: 1, completed: true },
    { week: 2, earnings: 3, completed: true },
    { week: 3, earnings: 2, completed: true },
    { week: 4, earnings: 0, completed: false },
    { week: 5, earnings: 0, completed: false },
];

// Topics Data for Course Progress
export const topics = [
    {
        id: 1,
        title: "Identify Uppercase Letters",
        totalSkills: 111,
        progress: 0,
        icon: <Target className="h-5 w-5" />,
        expanded: true,
        lessons: [
            {
                title: "ABCD",
                totalSkills: 17,
                skills: 0,
                items: [
                    { title: "Find the Letter", letter: "A", totalSkills: 4, skills: 0, accuracy: 0 },
                    { title: "Find the Letter", letter: "B", totalSkills: 4, skills: 0, accuracy: 0 },
                    { title: "Find the Letter", letter: "C", totalSkills: 4, skills: 0, accuracy: 0 },
                    { title: "Find the Letter", letter: "D", totalSkills: 4, skills: 0, accuracy: 0 },
                    { title: "Spiral", letter: "", totalSkills: 1, skills: 0, accuracy: 0 },
                ],
            },
            {
                title: "EFG",
                totalSkills: 13,
                skills: 0,
                items: [
                    { title: "Find the Letter", letter: "E", totalSkills: 4, skills: 0, accuracy: 0 },
                    { title: "Find the Letter", letter: "F", totalSkills: 4, skills: 0, accuracy: 0 },
                    { title: "Find the Letter", letter: "G", totalSkills: 4, skills: 0, accuracy: 0 },
                    { title: "Wave Pattern", letter: "", totalSkills: 1, skills: 0, accuracy: 0 },
                ],
            },
            {
                title: "HIJK",
                totalSkills: 17,
                skills: 0,
                items: [
                    { title: "Find the Letter", letter: "H", totalSkills: 4, skills: 0, accuracy: 0 },
                    { title: "Find the Letter", letter: "I", totalSkills: 4, skills: 0, accuracy: 0 },
                    { title: "Find the Letter", letter: "J", totalSkills: 4, skills: 0, accuracy: 0 },
                    { title: "Find the Letter", letter: "K", totalSkills: 4, skills: 0, accuracy: 0 },
                    { title: "Zigzag", letter: "", totalSkills: 1, skills: 0, accuracy: 0 },
                ],
            },
            {
                title: "LMNO",
                totalSkills: 17,
                skills: 0,
                items: [
                    { title: "Find the Letter", letter: "L", totalSkills: 4, skills: 0, accuracy: 0 },
                    { title: "Find the Letter", letter: "M", totalSkills: 4, skills: 0, accuracy: 0 },
                    { title: "Find the Letter", letter: "N", totalSkills: 4, skills: 0, accuracy: 0 },
                    { title: "Find the Letter", letter: "O", totalSkills: 4, skills: 0, accuracy: 0 },
                    { title: "Circle", letter: "", totalSkills: 1, skills: 0, accuracy: 0 },
                ],
            },
            {
                title: "PQRS",
                totalSkills: 17,
                skills: 0,
                items: [
                    { title: "Find the Letter", letter: "P", totalSkills: 4, skills: 0, accuracy: 0 },
                    { title: "Find the Letter", letter: "Q", totalSkills: 4, skills: 0, accuracy: 0 },
                    { title: "Find the Letter", letter: "R", totalSkills: 4, skills: 0, accuracy: 0 },
                    { title: "Find the Letter", letter: "S", totalSkills: 4, skills: 0, accuracy: 0 },
                    { title: "Diamond", letter: "", totalSkills: 1, skills: 0, accuracy: 0 },
                ],
            },
            {
                title: "TUVW",
                totalSkills: 17,
                skills: 0,
                items: [],
            },
            {
                title: "XYZ",
                totalSkills: 13,
                skills: 0,
                items: [],
            },
        ],
    },
    {
        id: 2,
        title: "Trace Uppercase Letters",
        totalSkills: 36,
        progress: 0,
        icon: <BookOpen className="h-5 w-5" />,
        expanded: false,
    },
    {
        id: 3,
        title: "Identify Lowercase Letters",
        totalSkills: 118,
        progress: 0,
        icon: <Target className="h-5 w-5" />,
        expanded: false,
    },
    {
        id: 4,
        title: "Trace Lowercase Letters",
        totalSkills: 36,
        progress: 0,
        icon: <BookOpen className="h-5 w-5" />,
        expanded: false,
    },
    {
        id: 5,
        title: "Alphabet Songs",
        totalSkills: 34,
        progress: 0,
        icon: <Award className="h-5 w-5" />,
        expanded: false,
    },
    {
        id: 6,
        title: "Letter Sequence",
        totalSkills: 20,
        progress: 0,
        icon: <Target className="h-5 w-5" />,
        expanded: false,
    },
    {
        id: 7,
        title: "Sight Words",
        totalSkills: 75,
        progress: 0,
        icon: <BookOpen className="h-5 w-5" />,
        expanded: false,
    },
    {
        id: 8,
        title: "Books and Readers",
        totalSkills: 75,
        progress: 0,
        icon: <Award className="h-5 w-5" />,
        expanded: false,
    },
];

export default topics;