// BackgroundStars.jsx
const BackgroundStars = () => {
  return (
    <div className="absolute inset-0 bg-[#0a085f] overflow-hidden -z-10">
      {/* Các ngôi sao nhỏ */}
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          className="absolute w-[4px] h-[4px] bg-cyan-200 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random(),
          }}
        />
      ))}

      {/* Planet màu tím */}
      <div className="absolute w-12 h-12 bg-purple-500 rounded-full left-[60%] top-[40%]" />
      {/* Planet màu cam */}
      <div className="absolute w-12 h-12 bg-orange-400 rounded-full left-[52%] top-[55%]" />
      {/* Planet màu xanh dương */}
      <div className="absolute w-12 h-12 bg-blue-400 rounded-full left-[57%] top-[45%]" />

      {/* Shape lớn mờ */}
      <div className="absolute bg-[#13125d] w-[300px] h-[300px] rounded-full top-[30%] left-[70%] opacity-80 blur-xl" />
      <div className="absolute bg-[#13125d] w-[400px] h-[400px] rounded-tl-full bottom-0 left-0 opacity-70" />
    </div>
  );
};

export default BackgroundStars;
