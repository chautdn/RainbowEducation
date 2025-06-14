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
  "10 Loại động vật quanh chúng ta":
    "https://res.cloudinary.com/dvcpy4kmm/image/upload/v1749901310/maxresdefault_muaka9.jpg",
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
export function getCourseNamesByGrade(grade, categoryType) {
  // Gom tất cả courses lại
  const allCourses = [...readingCourses, ...writingCourses].filter(
    course => course.level === grade
  );

  // Lọc theo tag thay vì kiểm tra tiêu đề
  return allCourses.filter(course => course.tag === categoryType);
}

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
    tag: "vietnamese",
    lessonIndex: "1"
  },
  {
    id: 3,
    title: "10 Loại động vật quanh chúng ta",
    description: "Học cách nhận biết và phát âm các chữ cái tiếng Việt",
    image: courseImages["10 Loại động vật quanh chúng ta"],
    level: "Pre-K",
    duration: "30 phút",
    progress: 0,
    tag: "vietnamese",
    note: "animals",
    lessonIndex: "3"
  }
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
    tag: "vietnamese",
    lessonIndex:"2"
  },
  {
    id: 2,
    title: "Tập viết số đếm",
    description: "Học cách viết các số đếm từ 0 đến 9",
    image: courseImages["Tập viết số đếm"],
    level: "Pre-K",
    duration: "30 phút",
    progress: 0,
    tag: "math"
  },
];

export const letterGroups = [
    {
        id: 1,
        name: "Nhóm 1: Nguyên âm đầu tiên",
        description: "Các nguyên âm đầu tiên – dễ phát âm",
        letters: ["A", "Ă", "Â"]
    },
    {
        id: 2,
        name: "Nhóm 2: Âm đầu quen thuộc",
        description: "Âm đầu quen thuộc, dễ dùng với từ hình ảnh (Bóng, Cá, Đèn)",
        letters: ["B", "C", "D"]
    },
    {
        id: 3,
        name: "Nhóm 3: Phân biệt D – Đ",
        description: "Phân biệt D – Đ, thêm nguyên âm Ê",
        letters: ["Đ", "E", "Ê"]
    },
    {
        id: 4,
        name: "Nhóm 4: Âm phụ và nguyên âm dài",
        description: "Tăng âm phụ + nguyên âm dài I",
        letters: ["G", "H", "I"]
    },
    {
        id: 5,
        name: "Nhóm 5: Âm quen thuộc",
        description: "M là 'Mẹ', âm quen với bé",
        letters: ["K", "L", "M"]
    },
    {
        id: 6,
        name: "Nhóm 6: Âm tròn môi",
        description: "Âm tròn môi, dễ minh họa",
        letters: ["N", "O", "Ô"]
    },
    {
        id: 7,
        name: "Nhóm 7: Âm minh họa",
        description: "Có thể minh họa bằng tranh (Ô, Phin, Quả)",
        letters: ["Ơ", "P", "Q"]
    },
    {
        id: 8,
        name: "Nhóm 8: Âm nổi bật",
        description: "Các âm 'nổi bật', quen thuộc",
        letters: ["R", "S", "T"]
    },
    {
        id: 9,
        name: "Nhóm 9: Âm môi",
        description: "Âm môi, dễ hát và phát âm chậm",
        letters: ["U", "Ư", "V"]
    },
    {
        id: 10,
        name: "Nhóm 10: Kết thúc",
        description: "Kết thúc, dễ nghe, dễ minh họa (Xe, Yêu)",
        letters: ["X", "Y"]
    }
];

export const letterVideos = {
    "A": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749178684/chu_a_yfojk7.mp4",
    "Ă": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749178684/chu_ă_u25h2u.mp4",
    "Â": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749178684/chu_â_ddb4h7.mp4",
    "B": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749180393/chu_b_wt6jyk.mp4",
    "C": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749180588/chu_c_o5oxl4.mp4",
    "D": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749180588/chu_d_ebbhrj.mp4",
    "Đ": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749181262/chu_đ_zd4uot.mp4",
    "E": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749181262/chu_e_n2aetm.mp4",
    "Ê": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749181261/chu_ê_igd1si.mp4",
    "G": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749182045/chu_g_kzikqj.mp4",
    "H": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749182045/chu_h_ovqwxi.mp4",
    "I": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749182045/chu_i_qzqz0y.mp4",
    "K": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749182685/chu_k_e5spos.mp4",
    "L": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749182685/chu_l_zlrlg8.mp4",
    "M": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749182685/chu_m_wxpupi.mp4",
    "N": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749183199/chu_n_ottmpx.mp4",
    "O": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749183199/chu_o_bl0bxg.mp4",
    "Ô": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749183199/chu_ô_b5hkzp.mp4",
    "Ơ": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749183462/chu_ơ_d0k3fk.mp4",
    "P": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749183461/chu_p_lim81a.mp4",
    "Q": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749183461/chu_q_tcr9eo.mp4",
    "R": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749184068/chu_r_nf7lfm.mp4",
    "S": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749184068/chu_s_lvjztq.mp4",
    "T": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749184067/chu_t_oatbwm.mp4",
    "U": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749184619/chu_u_xax8be.mp4",
    "Ư": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749184620/chu_ư_cmgdch.mp4",
    "V": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749184619/chu_v_azjycs.mp4",
    "X": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749185316/chu_x_zyek1g.mp4",
    "Y": "https://res.cloudinary.com/dvcpy4kmm/video/upload/v1749185317/chu_y_xkb1kq.mp4",
};
