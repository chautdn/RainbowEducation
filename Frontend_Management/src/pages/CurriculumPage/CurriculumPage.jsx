import { useRef, useEffect, useState } from "react";
import CustomNavbar from '../../components/navbar/CustomNavbar';
import Tabs from '../../components/curriculum/Tabs';
import LearningPath from '../../components/curriculum/LearningPath';
import CategorySection from '../../components/curriculum/CategorySection';
import FallingNumbers from "../../components/sharedComponents/FallingNumbers";
import FallingShapes from "../../components/shapes/FallingShapes";
import ShapesAnimation from "../../components/sharedComponents/ShapesAnimation";

export const CurriculumPage = () => {
    const learningPathRef = useRef(null);
    const mathCategoryRef = useRef(null);
    const vietnameseCategoryRef = useRef(null);
    const animalsCategoryRef = useRef(null);
    const [isCompact, setIsCompact] = useState(false);
    const [activeTab, setActiveTab] = useState("learning");

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsCompact(true);
            } else {
                setIsCompact(false);
            }

            // Chỉ active tab khi section chiếm >= 80% viewport, nếu không thì active section có top gần top viewport
            const sections = [
                { key: "learning", ref: learningPathRef },
                { key: "math", ref: mathCategoryRef },
                { key: "vietnamese", ref: vietnameseCategoryRef },
                { key: "animals", ref: animalsCategoryRef },
            ];
            let found = null;
            let maxVisible = 0;
            let closestTop = null;
            let minTopDistance = Infinity;
            sections.forEach(section => {
                if (section.ref.current) {
                    const rect = section.ref.current.getBoundingClientRect();
                    const visibleTop = Math.max(rect.top, 0);
                    const visibleBottom = Math.min(rect.bottom, window.innerHeight);
                    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
                    if (visibleHeight >= window.innerHeight * 0.8 && visibleHeight > maxVisible) {
                        found = section.key;
                        maxVisible = visibleHeight;
                    }
                    // Nếu không có section nào đủ 80%, lấy section có top gần top viewport nhất
                    if (rect.top >= 0 && rect.top < minTopDistance) {
                        minTopDistance = rect.top;
                        closestTop = section.key;
                    }
                }
            });
            if (found) setActiveTab(found);
            else if (closestTop) setActiveTab(closestTop);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const smoothScrollTo = (element) => {
        if (!element) return;

        // Lấy chiều cao thực tế của navbar và tabs
        const navbar = document.querySelector('.sticky.top-0');
        const navbarHeight = navbar ? navbar.offsetHeight : 100;

        const elementPosition = element.getBoundingClientRect().top;
        const startPosition = window.pageYOffset;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight + 20; // Thêm 20px padding
        const distance = offsetPosition - startPosition;
        const duration = 1000;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);

            const easeInOutCubic = progress => {
                return progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            };

            window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    };

    const handleScrollTo = (section) => {
        if (section === "learning" && learningPathRef.current) {
            smoothScrollTo(learningPathRef.current);
        }
        if (section === "math" && mathCategoryRef.current) {
            smoothScrollTo(mathCategoryRef.current);
        }
        if (section === "vietnamese" && vietnameseCategoryRef.current) {
            smoothScrollTo(vietnameseCategoryRef.current);
        }
        if (section === "animals" && animalsCategoryRef.current) {
            smoothScrollTo(animalsCategoryRef.current);
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-r from-blue-200 via-yellow-100 to-pink-200">
            {/* Animated Background Elements */}
            <FallingNumbers />
            <FallingShapes />
            <ShapesAnimation />

            {/* Orbiting Icons */}
            <span className="text-7xl orbiting-icon2 fixed top-20 right-10 z-0">
                🚀
            </span>
            <span className="text-8xl orbiting-icon fixed bottom-20 left-10 z-0">
                🚀
            </span>

            {/* Additional floating educational icons */}
            <span className="text-6xl fixed top-1/3 left-5 z-0 animate-bounce" style={{ animationDelay: '0.5s' }}>
                📚
            </span>
            <span className="text-5xl fixed top-1/2 right-5 z-0 animate-bounce" style={{ animationDelay: '1s' }}>
                ✏️
            </span>
            <span className="text-6xl fixed bottom-1/3 left-1/4 z-0 animate-bounce" style={{ animationDelay: '1.5s' }}>
                🎓
            </span>
            <span className="text-5xl fixed top-1/4 right-1/3 z-0 animate-bounce" style={{ animationDelay: '2s' }}>
                📖
            </span>

            <main className="relative z-10">
                <div>
                    <div className="sticky top-0 z-50">
                        <CustomNavbar isCompact={isCompact} />
                        <div className="w-full h-12 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-b-2xl blur-sm"></div>
                        <Tabs onTabClick={handleScrollTo} activeTab={activeTab} />
                    </div>

                    <div className="p-6 max-w-7xl mx-auto" ref={learningPathRef}>
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-8 mb-8">
                            <LearningPath />
                        </div>
                    </div>

                    <div className="p-6 max-w-7xl mx-auto" ref={mathCategoryRef}>
                        <div className="bg-gradient-to-br from-blue-100/90 to-cyan-100/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-8 mb-8">
                            <CategorySection title="Chương trình toán học" active={activeTab === "math"} categoryType="math" />
                        </div>

                        {/* Fun Math Elements */}
                        <div className="flex justify-center space-x-6 mt-8 mb-8">
                            <div className="bg-blue-300 p-6 rounded-full shadow-xl animate-bounce border-2 border-white">
                                🔢
                            </div>
                            <div className="bg-cyan-300 p-6 rounded-full shadow-xl animate-bounce border-2 border-white" style={{ animationDelay: '0.2s' }}>
                                ➕
                            </div>
                            <div className="bg-teal-300 p-6 rounded-full shadow-xl animate-bounce border-2 border-white" style={{ animationDelay: '0.4s' }}>
                                ➖
                            </div>
                            <div className="bg-blue-400 p-6 rounded-full shadow-xl animate-bounce border-2 border-white" style={{ animationDelay: '0.6s' }}>
                                ✖️
                            </div>
                        </div>
                    </div>

                    <div className="p-6 max-w-7xl mx-auto" ref={vietnameseCategoryRef}>
                        <div className="bg-gradient-to-br from-pink-100/90 to-rose-100/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-8 mb-8">
                            <CategorySection title="Chương trình Tiếng Việt" active={activeTab === "vietnamese"} categoryType="vietnamese" />
                        </div>

                    </div>

                    <div className="p-6 max-w-7xl mx-auto" ref={animalsCategoryRef}>
                        {/* Animal Lessons Section */}
                        <div className="bg-gradient-to-br from-purple-100/90 to-violet-100/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-8 mb-8 relative overflow-hidden">
                            {/* Background decoration */}
                            <div className="absolute top-4 right-4 text-6xl opacity-20">🐾</div>
                            <div className="absolute bottom-4 left-4 text-5xl opacity-20">🦁</div>
                            <div className="absolute top-1/2 right-1/3 text-4xl opacity-15">🐘</div>
                            
                            <CategorySection title="🐾 Bài học về động vật 🐾" active={activeTab === "animals"} categoryType="vietnamese" note="animals" />
                        </div>

                        {/* Fun Animals Elements */}
                        <div className="flex justify-center space-x-6 mt-8 mb-8">
                            <div className="bg-purple-300 p-6 rounded-full shadow-xl animate-bounce border-2 border-white">
                                🐶
                            </div>
                            <div className="bg-violet-300 p-6 rounded-full shadow-xl animate-bounce border-2 border-white" style={{ animationDelay: '0.2s' }}>
                                🐱
                            </div>
                            <div className="bg-indigo-300 p-6 rounded-full shadow-xl animate-bounce border-2 border-white" style={{ animationDelay: '0.4s' }}>
                                🐘
                            </div>
                            <div className="bg-purple-400 p-6 rounded-full shadow-xl animate-bounce border-2 border-white" style={{ animationDelay: '0.6s' }}>
                                🦁
                            </div>
                        </div>

                        {/* Fun Vietnamese Elements */}
                        <div className="flex justify-center space-x-6 mt-8 mb-8">
                            <div className="bg-pink-300 p-6 rounded-full shadow-xl animate-bounce border-2 border-white">
                                📝
                            </div>
                            <div className="bg-rose-300 p-6 rounded-full shadow-xl animate-bounce border-2 border-white" style={{ animationDelay: '0.2s' }}>
                                📖
                            </div>
                            <div className="bg-red-300 p-6 rounded-full shadow-xl animate-bounce border-2 border-white" style={{ animationDelay: '0.4s' }}>
                                🗣️
                            </div>
                            <div className="bg-pink-400 p-6 rounded-full shadow-xl animate-bounce border-2 border-white" style={{ animationDelay: '0.6s' }}>
                                📚
                            </div>
                        </div>
                    </div>

                    {/* Bottom Fun Section */}
                    <div className="p-6 max-w-7xl mx-auto text-center mb-12">
                        <div className="bg-gradient-to-r from-yellow-200/90 to-orange-200/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-8">
                            <h2 className="text-3xl font-bold text-orange-700 mb-4 drop-shadow-lg">
                                Keep Learning & Having Fun! 🌟
                            </h2>
                            <p className="text-lg text-orange-600 font-semibold">
                                Explore all subjects and unlock your potential!
                            </p>
                            <div className="flex justify-center space-x-4 mt-6">
                                <div className="bg-yellow-300 p-4 rounded-full shadow-xl animate-bounce border-2 border-white">
                                    🏆
                                </div>
                                <div className="bg-orange-300 p-4 rounded-full shadow-xl animate-bounce border-2 border-white" style={{ animationDelay: '0.3s' }}>
                                    🎉
                                </div>
                                <div className="bg-red-300 p-4 rounded-full shadow-xl animate-bounce border-2 border-white" style={{ animationDelay: '0.6s' }}>
                                    🌈
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};