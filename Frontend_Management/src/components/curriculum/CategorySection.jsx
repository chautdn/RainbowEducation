import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { getCourseNamesByGrade, courseImages } from "../../data/courseData";
import { Lock, Crown } from "lucide-react";

export default function CategorySection({ title, active, categoryType, note }) {
  const navigate = useNavigate();
  const grades = ["Pre-K", "K", "1", "2", "3", "4", "5"];
  const [selectedGrade, setSelectedGrade] = React.useState("Pre-K");

  // Lấy danh sách khóa học dựa trên grade và categoryType
  const currentCourseNames = getCourseNamesByGrade(
    selectedGrade,
    categoryType,
    note
  );

  const handleCourseClick = (course) => {
  if (categoryType === "math") {
    // Use lessonId instead of lessonIndex, and use 'math' instead of 'numbers'
    navigate(`/lesson-detail/math/lesson${course.lessonId}`);
  } else if (categoryType === "vietnamese") {
    // Kiểm tra nếu là khóa học động vật
    if (course.note === "animals") {
      navigate(`/lesson-detail/animal/lesson${course.lessonId}`);
    } else {
      navigate(`/lesson-detail/vietnamese/lesson${course.lessonId}`);
    }
  }
};

  return (
    <div
      className={`rounded-xl bg-[#3a3fa3] shadow p-6 min-h-[75vh] font-sans transition-all duration-500
        ${
          active
            ? "scale-100 opacity-100"
            : "scale-90 opacity-60 pointer-events-none"
        }`}
    >
      {/* Header */}
      <h2 className="font-extrabold text-2xl text-white tracking-wide mb-6">
        {title?.toUpperCase()}
      </h2>

      {/* Grade */}
      <div className="flex items-center gap-4 mb-8 pl-5">
        <span
          className="text-white text-lg font-semibold mr-1"
          style={{ minWidth: 70 }}
        >
          Lớp
        </span>
        {grades.map((grade) => (
          <button
            key={grade}
            onClick={() => setSelectedGrade(grade)}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold transition-all
              ${
                selectedGrade === grade
                  ? "bg-[#6ee7e7] text-[#23326d] shadow-lg"
                  : "bg-[#23277e] text-white hover:bg-[#4b50b7]"
              }
            `}
          >
            {grade}
          </button>
        ))}
      </div>

      {/* Danh sách khóa học */}
      <div className="grid grid-cols-4 gap-6">
        {currentCourseNames.map((course, index) => {
          const getDescription = () => course.description || "Mô tả khóa học";
          const getIcon = () => (course.tag === "math" ? "🔢" : "📚");
          const courseName =
            course.title || course.name || `Course ${index + 1}`;

          return (
            <div
              key={course._id || course.id || index}
              onClick={() => handleCourseClick(course)}
                                            className={`bg-[#302f5b] rounded-md text-white text-xs p-4 min-w-[220px] min-h-[220px] shadow-md hover:brightness-110 transition-all duration-300 flex flex-col cursor-pointer relative ${
                 course.tag === "math"
                   ? "border-2 border-green-400"
                   : "border-2 border-purple-400"
                } ${!course.isFree ? 'ring-4 ring-red-400 ring-opacity-50 shadow-xl' : ''}`}
            >
                             {/* Course Type Badge */}
               <div className="absolute top-2 right-2 text-lg">{getIcon()}</div>
               
               {/* Payment Status Badge */}
               {!course.isFree && (
                 <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                   <Lock size={12} />
                   PREMIUM
                 </div>
               )}
               
               {course.isFree && (
                 <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                   MIỄN PHÍ
                 </div>
               )}

                              {courseImages[courseName] ? (
                  <img
                    src={courseImages[courseName]}
                    alt={courseName}
                    className={`w-full h-32 object-cover rounded mb-4 transition-all duration-300 ${
                      !course.isFree ? 'blur-sm hover:blur-none' : ''
                    }`}
                  />
                ) : (
                                 <div
                   className={`w-full h-32 rounded mb-4 flex items-center justify-center text-4xl transition-all duration-300
                   ${
                     categoryType === "math"
                       ? "bg-gradient-to-br from-green-500 to-blue-500"
                       : "bg-gradient-to-br from-purple-500 to-pink-500"
                   }
                   ${!course.isFree ? 'blur-sm hover:blur-none' : ''}
                 `}
                 >
                   {getIcon()}
                 </div>
              )}

                             <div className="font-semibold text-base mb-2">
                 {course.title || courseName}
               </div>
               
               {/* Payment Overlay */}
               {!course.isFree && (
                 <div className="absolute inset-0 bg-black bg-opacity-60 rounded-md flex flex-col items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                   <Lock size={32} className="mb-2" />
                   <div className="text-sm font-bold">Cần thanh toán</div>
                   <div className="text-xs font-semibold">
                     {course.price ? `${course.price.toLocaleString('vi-VN')} VND` : '75.000 VND'}
                   </div>
                   <div className="text-xs mt-2 text-center px-2">
                     Nhấn để mua và truy cập bài học
                   </div>
                 </div>
               )}
              <div className="text-xs">{getDescription()}</div>

              {/* Progress indicator */}
              <div className="mt-auto pt-2">
                <div className="w-full bg-gray-600 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full 
                      ${
                        categoryType === "math"
                          ? "bg-green-400"
                          : "bg-purple-400"
                      }
                    `}
                    style={{ width: "0%" }}
                  ></div>
                </div>
                <div className="text-xs mt-1 opacity-75">
                  {categoryType === "math" ? "0/10 số" : "0/10 bài học"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

CategorySection.propTypes = {
  title: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  categoryType: PropTypes.oneOf(["math", "vietnamese"]).isRequired,
  note: PropTypes.string,
};

CategorySection.defaultProps = {
  title: "",
  active: false,
  note: "",
};
