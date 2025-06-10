import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getCourseNamesByGrade, courseImages } from '../../data/courseData';

export default function CategorySection({ title, active }) {
  const navigate = useNavigate();
  const grades = ['Pre-K', 'K', '1', '2', '3', '4', '5'];
  const [selectedGrade, setSelectedGrade] = React.useState('Pre-K');

  const handleCourseClick = (lessonIndex, courseName) => {
  // Check if it's a number-related course first (regardless of section)
  if (courseName?.toLowerCase().includes('số') || 
      courseName?.toLowerCase().includes('toán') ||
      courseName?.toLowerCase().includes('đếm') ||
      courseName?.toLowerCase().includes('number')) {
    navigate(`/lesson-detail/numbers/lesson${lessonIndex + 1}`);
  } 
  // Check if it's alphabet-related course
  else if (courseName?.toLowerCase().includes('chữ cái') || 
           courseName?.toLowerCase().includes('alphabet') ||
           courseName?.toLowerCase().includes('bảng chữ cái')) {
    navigate(`/lesson-detail/alphabet/lesson${lessonIndex + 1}`);
  }
  // Default to Vietnamese lessons for any other course
  else {
    navigate(`/lesson-detail/vietnamese/lesson${lessonIndex + 1}`);
  }
};

  const currentCourseNames = getCourseNamesByGrade(selectedGrade);

  return (
    <div
      className={`rounded-xl bg-[#3a3fa3] shadow p-6 min-h-[75vh] font-sans transition-all duration-500
        ${active ? 'scale-100 opacity-100' : 'scale-90 opacity-60 pointer-events-none'}`}
    >
      {/* Header */}
      <h2 className="font-extrabold text-2xl text-white tracking-wide mb-6">{title?.toUpperCase()}</h2>

      {/* Grade */}
      <div className="flex items-center gap-4 mb-8 pl-5">
        <span className="text-white text-lg font-semibold mr-1" style={{ minWidth: 70 }}>Lớp</span>
        {grades.map((grade) => (
          <button
            key={grade}
            onClick={() => setSelectedGrade(grade)}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold transition-all
              ${selectedGrade === grade
                ? 'bg-[#6ee7e7] text-[#23326d] shadow-lg'
                : 'bg-[#23277e] text-white hover:bg-[#4b50b7]'}
            `}
          >
            {grade}
          </button>
        ))}
      </div>

      {/* Danh sách khóa học */}
      <div className="grid grid-cols-4 gap-6">
        {currentCourseNames.map((courseName, i) => {
          // Determine course type for styling and description
          const isNumberCourse = courseName?.toLowerCase().includes('số') || 
                                courseName?.toLowerCase().includes('toán') ||
                                courseName?.toLowerCase().includes('đếm') ||
                                courseName?.toLowerCase().includes('number');
          
          const isAlphabetCourse = courseName?.toLowerCase().includes('chữ cái') || 
                                 courseName?.toLowerCase().includes('alphabet') ||
                                 courseName?.toLowerCase().includes('bảng chữ cái');

          const getDescription = () => {
            if (isNumberCourse) return "Học viết số và đếm";
            if (isAlphabetCourse) return "Học bảng chữ cái";
            return "Kỹ năng tiếng Việt";
          };

          const getIcon = () => {
            if (isNumberCourse) return "🔢";
            if (isAlphabetCourse) return "🔤";
            return "📚";
          };

          return (
            <div
              key={i}
              onClick={() => handleCourseClick(i, courseName)}
              className={`bg-[#302f5b] rounded-md text-white text-xs p-4 min-w-[220px] min-h-[220px] shadow-md hover:brightness-110 transition flex flex-col cursor-pointer relative
                ${isNumberCourse ? 'border-2 border-green-400' : ''}
                ${isAlphabetCourse ? 'border-2 border-purple-400' : ''}
              `}
            >
              {/* Course Type Badge */}
              <div className="absolute top-2 right-2 text-lg">
                {getIcon()}
              </div>

              {courseImages[courseName] ? (
                <img
                  src={courseImages[courseName]}
                  alt={courseName}
                  className="w-full h-32 object-cover rounded mb-4"
                />
              ) : (
                <div className={`w-full h-32 rounded mb-4 flex items-center justify-center text-4xl
                  ${isNumberCourse ? 'bg-gradient-to-br from-green-500 to-blue-500' : ''}
                  ${isAlphabetCourse ? 'bg-gradient-to-br from-purple-500 to-pink-500' : ''}
                  ${!isNumberCourse && !isAlphabetCourse ? 'bg-[#1f1f2e]' : ''}
                `}>
                  {getIcon()}
                </div>
              )}
              
              <div className="font-semibold text-base mb-2">{courseName}</div>
              <div className="text-xs">{getDescription()}</div>
              
              {/* Progress indicator for number/alphabet courses */}
              {(isNumberCourse || isAlphabetCourse) && (
                <div className="mt-auto pt-2">
                  <div className="w-full bg-gray-600 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full 
                        ${isNumberCourse ? 'bg-green-400' : 'bg-purple-400'}
                      `}
                      style={{ width: '0%' }}
                    ></div>
                  </div>
                  <div className="text-xs mt-1 opacity-75">
                    {isNumberCourse ? '0/10 số' : '0/29 chữ cái'}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

CategorySection.propTypes = {
  title: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired
};

CategorySection.defaultProps = {
  title: '',
  active: false
};