"use client"

import { useEffect, useRef, useState } from "react"

export default function LetterAnimation({ letter, isPlaying, onComplete }) {
    const canvasRef = useRef(null)
    const [progress, setProgress] = useState(0)

    const letterPaths = {
        A: ["M50,150 L100,50 L150,150", "M75,100 L125,100"],
        B: ["M50,50 L50,150 L125,150 C150,150 150,100 125,100 L50,100 C75,100 150,100 150,50 C150,50 125,50 50,50"],
        C: ["M150,50 C100,25 50,50 50,100 C50,150 100,175 150,150"],
    }

    const defaultPath = ["M50,50 L150,50 L150,150 L50,150 L50,50"]

    useEffect(() => {
        if (!isPlaying) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.strokeStyle = "#4338ca"
        ctx.lineWidth = 8
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        const paths = letterPaths[letter] || defaultPath

        let currentPathIndex = 0
        let animationProgress = 0
        let lastTimestamp = 0

        const parsePathToPoints = (path) => {
            return path
                .split(" ")
                .filter((cmd) => cmd.includes(","))
                .map((point) => {
                    const [x, y] = point.replace(/[A-Z]/g, "").split(",")
                    return [parseInt(x), parseInt(y)]
                })
        }

        const animate = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp
            const deltaTime = timestamp - lastTimestamp
            lastTimestamp = timestamp

            animationProgress += deltaTime * 0.001

            const currentPathStr = paths[currentPathIndex]
            const points = parsePathToPoints(currentPathStr)

            const pointsToDraw = Math.min(
                Math.floor(animationProgress * 5),
                points.length,
            )

            if (pointsToDraw > 0) {
                ctx.beginPath()
                ctx.moveTo(points[0][0], points[0][1])

                for (let i = 1; i < pointsToDraw; i++) {
                    ctx.lineTo(points[i][0], points[i][1])
                }

                ctx.stroke()
            }

            const totalPoints = paths.reduce(
                (sum, path) => sum + parsePathToPoints(path).length,
                0,
            )
            const currentTotalPoints =
                paths
                    .slice(0, currentPathIndex)
                    .reduce((sum, path) => sum + parsePathToPoints(path).length, 0) +
                pointsToDraw

            setProgress(Math.min((currentTotalPoints / totalPoints) * 100, 100))

            if (pointsToDraw >= points.length) {
                currentPathIndex++
                animationProgress = 0

                if (currentPathIndex >= paths.length) {
                    onComplete()
                    return
                }
            }

            if (currentPathIndex < paths.length) {
                requestAnimationFrame(animate)
            }
        }

        if (isPlaying) {
            requestAnimationFrame(animate)
        }

        return () => { }
    }, [letter, isPlaying, onComplete])

    useEffect(() => {
        if (isPlaying) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.strokeStyle = "#4338ca"
        ctx.lineWidth = 8
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        const paths = letterPaths[letter] || defaultPath

        paths.forEach((pathStr) => {
            const points = pathStr
                .split(" ")
                .filter((cmd) => cmd.includes(","))
                .map((point) => {
                    const [x, y] = point.replace(/[A-Z]/g, "").split(",")
                    return [parseInt(x), parseInt(y)]
                })

            if (points.length > 0) {
                ctx.beginPath()
                ctx.moveTo(points[0][0], points[0][1])

                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i][0], points[i][1])
                }

                ctx.stroke()
            }
        })

        setProgress(100)
    }, [letter, isPlaying])

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
            <canvas ref={canvasRef} width={200} height={200} className="border-0" />

            <div className="absolute opacity-10 text-9xl font-bold text-blue-300 pointer-events-none">
                {letter}
            </div>

            {isPlaying && (
                <div className="absolute bottom-4 left-0 right-0 px-4">
                    <div className="w-full bg-blue-100 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    )
}
