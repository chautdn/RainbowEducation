import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const SkillCourseList = ({ skillName, courses, onViewAll }) => {
  const navigate = useNavigate();

  const handleCourseClick = (course) => {
    console.log('Clicking course:', course);
    const path = `/lesson-detail/${course.tag}/lesson${course.lessonId}`;
    console.log('Navigating to:', path);
    navigate(path);
  };

  return (
    <div
      className={`max-w-[1200px] mx-auto rounded-2xl py-10 px-6 my-8 shadow-md bg-[#4441d3]`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-white text-xl uppercase tracking-wide">
          {skillName}
        </h2>
        <button
          onClick={onViewAll}
          className="text-white font-bold text-base px-8 py-2 rounded-full border-2 border-white bg-[#6366d6] flex items-center gap-2 shadow hover:bg-[#7a7cf0] transition-all duration-200"
        >
          Xem thêm <span className="ml-2 text-xl">→</span>
        </button>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-[#6ee7e7]">
        {courses.map((course) => {
          console.log('Rendering course:', course);
          return (
            <div
              key={course.id}
              onClick={() => handleCourseClick(course)}
              className="bg-[#120f87] rounded-xl p-3 text-white shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer"
            >
              {/* Course Image */}
              <div className="h-28 rounded-xl bg-white mb-3 border-4 border-white overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Course Name */}
              <div className="text-base font-bold mb-1 truncate">{course.title}</div>
              {/* Course Description */}
              <div className="text-xs text-gray-300">{course.description}</div>
              {/* Course Level and Duration */}
              <div className="flex justify-between items-center mt-2 text-xs">
                <span className="bg-blue-500 px-2 py-1 rounded">{course.level}</span>
                <span className="text-gray-300">{course.duration}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

SkillCourseList.propTypes = {
  skillName: PropTypes.string.isRequired,
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      level: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      progress: PropTypes.number.isRequired,
      lessonId: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      tag: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  onViewAll: PropTypes.func.isRequired,
};

export default SkillCourseList;