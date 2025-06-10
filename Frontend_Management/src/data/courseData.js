export const sampleCourses = [
  { id: 1, name: "Tên khóa học", description: "56 kỹ năng" },
  { id: 2, name: "Tên khóa học", description: "56 kỹ năng" },
  { id: 3, name: "Tên khóa học", description: "56 kỹ năng" },
  { id: 4, name: "Tên khóa học", description: "56 kỹ năng" },
];

// Vietnamese course names
export const vietnameseCourseNames = [
  "Học chữ cái",
  "Tập đọc cơ bản",
  "Viết chữ đẹp",
  "Từ vựng hàng ngày",
  "Câu chuyện ngắn",
  "Thơ ca thiếu nhi",
  "Ngữ pháp cơ bản",
  "Giao tiếp hàng ngày",
];

// Course images mapping
export const courseImages = {
  "Nhận biết chữ cái":
    "https://res.cloudinary.com/dvcpy4kmm/image/upload/v1749406467/29vneseWords_f5etpu.jpg",
  "Tập viết chữ thường":
    "https://res.cloudinary.com/dvcpy4kmm/image/upload/v1749407045/29VNwriting_uvrqin.jpg",
  "Tập viết số đếm":
    "https://res.cloudinary.com/dctmuwsdx/image/upload/v1749519393/number_oc4nqw.jpg",
};

// Courses by grade
export const coursesByGrade = {
  "Pre-K": [
    "Nhận biết chữ cái",
    "Tập viết chữ thường",
    "Tập viết số đếm",
    "Gia đình và bạn bè",
    "Trái cây và rau củ",
    "Phương tiện giao thông",
    "Thời tiết",
    "Số đếm cơ bản",
  ],
  K: [
    "Bảng chữ cái tiếng Việt",
    "Tập viết chữ in hoa",
    "Từ đơn giản",
    "Câu chào hỏi",
    "Đọc tranh kể chuyện",
    "Hát đồng dao",
    "Tô màu chữ cái",
    "Ghép âm tiết",
  ],
  1: [
    "Học chữ cái A-Z",
    "Viết chữ thường",
    "Đọc từng từ",
    "Câu đơn giản",
    "Truyện cổ tích",
    "Thơ hai câu",
    "Tập làm văn",
    "Chính tả cơ bản",
  ],
  2: [
    "Ngữ âm tiếng Việt",
    "Viết đoạn văn ngắn",
    "Đọc hiểu văn bản",
    "Kể chuyện",
    "Thành ngữ dân gian",
    "Ca dao tục ngữ",
    "Tả người tả cảnh",
    "Làm văn miêu tả",
  ],
  3: [
    "Phân tích từ loại",
    "Viết thư cá nhân",
    "Đọc truyện dài",
    "Thảo luận nhóm",
    "Văn học thiếu nhi",
    "Sáng tác thơ",
    "Kỹ năng thuyết trình",
    "Nghị luận đơn giản",
  ],
  4: [
    "Ngữ pháp nâng cao",
    "Viết báo cáo",
    "Phân tích tác phẩm",
    "Tranh luận",
    "Văn học cổ điển",
    "Sáng tác truyện ngắn",
    "Diễn thuyết",
    "Luận văn ngắn",
  ],
  5: [
    "Tinh thông ngữ pháp",
    "Viết luận văn",
    "Phê bình văn học",
    "Hùng biện",
    "Tác phẩm kinh điển",
    "Sáng tác sáng tạo",
    "Giao tiếp xã hội",
    "Tư duy phản biện",
  ],
};

// Helper function to get course names by grade
export const getCourseNamesByGrade = (grade) => {
  return coursesByGrade[grade] || vietnameseCourseNames;
};

// Reading and writing courses for homepage
export const readingCourses = [
  {
    id: 1,
    title: "Nhận biết chữ cái",
    description: "Học cách nhận biết và phát âm các chữ cái tiếng Việt",
    image: courseImages["Nhận biết chữ cái"],
    level: "Pre-K",
    duration: "30 phút",
    progress: 0,
  },
];

export const writingCourses = [
  {
    id: 1,
    title: "Tập viết chữ thường",
    description: "Học cách viết chữ thường tiếng Việt đúng chuẩn",
    image: courseImages["Tập viết chữ thường"],
    level: "Pre-K",
    duration: "45 phút",
    progress: 0,
  },
  {
    id: 2,
    title: "Tập viết số đếm",
    description: "Học cách viết các số đếm từ 0 đến 9",
    image: courseImages["Tập viết số đếm"],
    level: "Pre-K",
    duration: "30 phút",
    progress: 0,
  },
];
