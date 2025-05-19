"use client"
import { useEffect, useState } from "react"
import { Loader } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 2000) // Splash screen duration (ms)
        return () => clearTimeout(timer)
    }, [])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="splash"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
                >
                    <div className="flex flex-col items-center space-y-4">
                        <Loader className="w-10 h-10 animate-spin text-primary" />
                        <h1 className="text-2xl font-bold text-primary">SpaceRep</h1>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
