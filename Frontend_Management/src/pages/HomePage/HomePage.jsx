import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../components/utils/AxiosInstance";
import CustomNavbar from "../../components/navbar/CustomNavbar";
import SkillCourseList from "../../components/SkillCourseList/SkillCourseList";
import FallingNumbers from "../../components/sharedComponents/FallingNumbers";
import FallingShapes from "../../components/shapes/FallingShapes";
import ShapesAnimation from "../../components/sharedComponents/ShapesAnimation";

export const HomePage = () => {
  const navigate = useNavigate();
  const [isCompact, setIsCompact] = useState(false);
  const [coursesBySkill, setCoursesBySkill] = useState({
    reading: [],
    writing: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Handle navbar compactness on scroll
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsCompact(true);
      } else {
        setIsCompact(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Fetch courses from API
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/course");
        const courses = response.data.data; // Access the 'data' field from the response

        // Group courses by type
        const groupedCourses = courses.reduce(
          (acc, course) => {
            const type = course.type.toLowerCase();
            if (type === "reading" || type === "writing") {
              acc[type].push({
                id: course._id, // Map '_id' to 'id'
                title: course.title,
                description: course.description,
                image: course.image,
                level: course.level,
                duration: course.duration,
                progress: course.progress || 0,
                lessonId: course.lessonId, // Add this line
                tag: course.tag,           // Add this line
                type: course.type,         // Add this line
                isActive: course.isActive, // Add this line
                createdAt: course.createdAt, // Add this line
                updatedAt: course.updatedAt, // Add this line
                category: course.category, // Add this line
              });
            }
            return acc;
          },
          { reading: [], writing: [] }
        );

        setCoursesBySkill(groupedCourses);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err.response?.data, err.response?.status);
        setError("Failed to fetch courses. Please try again later.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleViewAll = () => {
    navigate("/curriculum");
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 via-yellow-100 to-pink-200">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 via-yellow-100 to-pink-200">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

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

      <main className="relative z-10">
        <div>
          <div className="sticky top-0 z-50 bg-[#0a085f]/80 backdrop-blur-md">
            <CustomNavbar isCompact={isCompact} />
          </div>
          <div className="p-6">
            {coursesBySkill.reading.length > 0 && (
              <SkillCourseList
                skillName="KĨ NĂNG ĐỌC"
                courses={coursesBySkill.reading}
                onViewAll={handleViewAll}
              />
            )}
            {coursesBySkill.writing.length > 0 && (
              <SkillCourseList
                skillName="KĨ NĂNG VIẾT"
                courses={coursesBySkill.writing}
                onViewAll={handleViewAll}
                variant="blue-border"
              />
            )}

            {/* Fun Interactive Elements */}
            <div className="mt-12 text-center space-y-6">
              <div className="flex justify-center space-x-4">
                <div className="bg-yellow-300 p-4 rounded-full shadow-md animate-bounce">
                  🏆
                </div>
                <div className="bg-pink-300 p-4 rounded-full shadow-md animate-bounce">
                  🎉
                </div>
                <div className="bg-blue-300 p-4 rounded-full shadow-md animate-bounce">
                  🎮
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
