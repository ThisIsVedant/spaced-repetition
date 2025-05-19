// components/StarBackground.tsx
"use client"
import { useEffect, useRef } from "react"

export default function StarBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let width = window.innerWidth
        let height = window.innerHeight
        canvas.width = width
        canvas.height = height

        const stars = Array.from({ length: 100 }, () => createStar())

        function createStar() {
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5 + 0.5,
                speed: Math.random() + 0.5,
                opacity: Math.random()
            }
        }

        function drawStar(star: any) {
            const isDarkMode = document.documentElement.classList.contains("dark")

            const lightColor = `rgba(181, 58, 181, ${star.opacity})`
            const darkColor = `rgba(255, 255, 255, ${star.opacity})`

            ctx.beginPath()
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
            ctx.fillStyle = isDarkMode ? darkColor : lightColor
            ctx.fill()
        }

        function animate() {
            ctx.clearRect(0, 0, width, height)
            stars.forEach(star => {
                star.y += star.speed
                if (star.y > height) {
                    star.x = Math.random() * width
                    star.y = 0
                }
                drawStar(star)
            })
            requestAnimationFrame(animate)
        }

        animate()

        const handleResize = () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none"
        />
    )
}
