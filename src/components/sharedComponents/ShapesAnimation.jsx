import React from 'react'

const ShapesAnimation = () => {
    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-300 rounded-full opacity-75 animate-ping text-7xl">☀</div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-red-300 rounded-full opacity-75 animate-ping text-7xl">⬟</div>
            <div className="absolute top-[55%] right-0 w-32 h-32 bg-yellow-300 rounded-full opacity-75 animate-spin-slow"></div>
            <div className="absolute top-[58%] right-5 w-20 h-20 bg-blue-400 rounded-[10px] opacity-75 animate-spin"></div>
            <div className="absolute bottom-10 right-10 w-16 h-16 bg-green-400 rounded-full opacity-75 animate-ping">⬟</div>
            <div className="absolute bottom-20 left-10 w-20 h-20 bg-purple-300 rounded-full opacity-75 animate-bounce"></div>
            <div className="absolute top-[30%] right-10 w-24 h-24 bg-orange-400 rounded-full opacity-75 animate-bounce"></div>
            <div className="absolute top-[30%] left-10 w-24 h-24 bg-orange-400 rounded-full opacity-75 animate-bounce"></div>
            <div className="absolute top-[60%] left-20 w-28 h-28 bg-teal-300 rounded-full opacity-75 animate-spin-slow"></div>
        </div>
    )
}

export default ShapesAnimation
