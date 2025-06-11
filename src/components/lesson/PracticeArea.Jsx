"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { Trash2 } from "lucide-react"

interface PracticeAreaMiniProps {
    letter: string
}

export default function PracticeAreaMini({ letter }: PracticeAreaMiniProps) {
    const canvasRef = useRef < HTMLCanvasElement > (null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set up drawing style
        ctx.strokeStyle = "#7c3aed" // violet-600
        ctx.lineWidth = 3
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw background letter
        ctx.font = "80px sans-serif"
        ctx.fillStyle = "#ede9fe" // violet-100
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(letter, canvas.width / 2, canvas.height / 2)
    }, [letter])

    const getCoords = (
        e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    ) => {
        const canvas = canvasRef.current
        if (!canvas) return { x: 0, y: 0 }

        const rect = canvas.getBoundingClientRect()
        let clientX, clientY

        if ("touches" in e) {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
        } else {
            clientX = e.clientX
            clientY = e.clientY
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        }
    }

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const { x, y } = getCoords(e)
        setIsDrawing(true)
        setLastPosition({ x, y })
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return
        const { x, y } = getCoords(e)

        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!ctx) return

        ctx.beginPath()
        ctx.moveTo(lastPosition.x, lastPosition.y)
        ctx.lineTo(x, y)
        ctx.stroke()

        setLastPosition({ x, y })
    }

    const stopDrawing = () => {
        setIsDrawing(false)
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!ctx || !canvas) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.font = "80px sans-serif"
        ctx.fillStyle = "#ede9fe"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(letter, canvas.width / 2, canvas.height / 2)
    }

    return (
        <div className="relative w-64 h-64">
            <canvas
                ref={canvasRef}
                width={256}
                height={256}
                className="border border-violet-300 rounded-md bg-white w-full h-full"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />

            <button
                onClick={clearCanvas}
                className="absolute bottom-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow"
                title="Clear"
            >
                <Trash2 size={16} />
            </button>
        </div>
    )
}
