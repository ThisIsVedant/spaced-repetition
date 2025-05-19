"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

type TitleStyle = "neon" | "glitch" | "comic" | "gradient" | "retro" | "outlined"

interface FancyTitleProps {
  text: string
  style?: TitleStyle
  className?: string
  animated?: boolean
}

export function FancyTitle({ text, style = "neon", className, animated = true }: FancyTitleProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <h1 className={cn("text-3xl font-bold", className)}>{text}</h1>
  }

  switch (style) {
    case "neon":
      return (
        <motion.h1
          className={cn("text-3xl font-bold text-white relative z-10", "text-shadow-neon tracking-wider", className)}
          initial={animated ? { opacity: 0, y: -20 } : false}
          animate={animated ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {text}
        </motion.h1>
      )

    case "glitch":
      return (
        <motion.div
          className={cn("relative", className)}
          initial={animated ? { opacity: 0 } : false}
          animate={animated ? { opacity: 1 } : false}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-primary relative z-10">{text}</h1>
          <span className="absolute inset-0 text-3xl font-bold text-accent opacity-70 glitch-effect-1 z-0">{text}</span>
          <span className="absolute inset-0 text-3xl font-bold text-secondary opacity-70 glitch-effect-2 z-0">
            {text}
          </span>
        </motion.div>
      )

    case "comic":
      return (
        <motion.h1
          className={cn("text-3xl font-extrabold text-white comic-text relative z-10", className)}
          initial={animated ? { scale: 0.8, opacity: 0 } : false}
          animate={animated ? { scale: 1, opacity: 1 } : false}
          transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
        >
          {text}
        </motion.h1>
      )

    case "gradient":
      return (
        <motion.h1
          className={cn(
            "text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary",
            className,
          )}
          initial={animated ? { opacity: 0, y: -10 } : false}
          animate={animated ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.5 }}
        >
          {text}
        </motion.h1>
      )

    case "retro":
      return (
        <motion.h1
          className={cn("text-3xl font-bold retro-text", className)}
          initial={animated ? { opacity: 0, rotateX: -90 } : false}
          animate={animated ? { opacity: 1, rotateX: 0 } : false}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {text}
        </motion.h1>
      )

    case "outlined":
      return (
        <motion.h1
          className={cn("text-3xl font-extrabold text-transparent text-stroke", className)}
          initial={animated ? { opacity: 0, scale: 1.2 } : false}
          animate={animated ? { opacity: 1, scale: 1 } : false}
          transition={{ duration: 0.4 }}
        >
          {text}
        </motion.h1>
      )

    default:
      return <h1 className={cn("text-3xl font-bold", className)}>{text}</h1>
  }
}
