import { useRef, useEffect, useState } from "react";
import CustomNavbar from "../../components/navbar/CustomNavbar";
import GameTabs from "../../components/gameZone/GameTab";
import BackgroundStars from "../../components/BackgroundStars";
import GameCategorySection from "../../components/gameZone/GameCategorySection";

export const GameZonePage = () => {
  const miniRef = useRef(null);
  const logicRef = useRef(null);
  const funRef = useRef(null);

  const [isCompact, setIsCompact] = useState(false);
  const [activeTab, setActiveTab] = useState("mini");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsCompact(true);
      } else {
        setIsCompact(false);
      }

      const sections = [
        { key: "mini", ref: miniRef },
        { key: "logic", ref: logicRef },
        { key: "fun", ref: funRef },
      ];

      let found = null;
      let maxVisible = 0;
      let closestTop = null;
      let minTopDistance = Infinity;
      sections.forEach((section) => {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          const visibleTop = Math.max(rect.top, 0);
          const visibleBottom = Math.min(rect.bottom, window.innerHeight);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          if (
            visibleHeight >= window.innerHeight * 0.8 &&
            visibleHeight > maxVisible
          ) {
            found = section.key;
            maxVisible = visibleHeight;
          }
          if (rect.top >= 0 && rect.top < minTopDistance) {
            minTopDistance = rect.top;
            closestTop = section.key;
          }
        }
      });
      if (found) setActiveTab(found);
      else if (closestTop) setActiveTab(closestTop);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const smoothScrollTo = (element) => {
    if (!element) return;
    const navbar = document.querySelector(".sticky.top-0");
    const navbarHeight = navbar ? navbar.offsetHeight : 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight + 20;
    const startPosition = window.pageYOffset;
    const distance = offsetPosition - startPosition;
    const duration = 1000;
    let start = null;

    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      const easeInOutCubic = (p) =>
        p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

      window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };
    requestAnimationFrame(animation);
  };

  const handleScrollTo = (section) => {
    if (section === "mini" && miniRef.current) smoothScrollTo(miniRef.current);
    if (section === "logic" && logicRef.current) smoothScrollTo(logicRef.current);
    if (section === "fun" && funRef.current) smoothScrollTo(funRef.current);
  };

  return (
    <div className="relative min-h-screen">
      <BackgroundStars />
      <main className="relative z-10">
        <div className="sticky top-0 z-50 bg-[#0a085f]">
          <CustomNavbar isCompact={isCompact} />
          <div className="w-full h-12 bg-black/30 rounded-b-2xl blur-sm" />
          <GameTabs onTabClick={handleScrollTo} activeTab={activeTab} />
        </div>

        <div className="p-6 max-w-7xl mx-auto" ref={miniRef}>
          <GameCategorySection title="Mini Game" active={activeTab === "mini"} />
        </div>

        <div className="p-6 max-w-7xl mx-auto" ref={logicRef}>
          <GameCategorySection title="Tư duy Logic" active={activeTab === "logic"} />
        </div>

        <div className="p-6 max-w-7xl mx-auto" ref={funRef}>
          <GameCategorySection title="Hoạt động vui" active={activeTab === "fun"} />
        </div>
      </main>
    </div>
  );
};
