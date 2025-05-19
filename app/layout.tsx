import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SpacedRepProvider } from "@/components/spaced-rep-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { Toaster } from "@/components/ui/toaster"
import StarBackground from "@/components/StarBackground";
import SplashScreen from "@/components/SplashScreen"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SpaceRep - Spaced Repetition Flashcards",
  description: "Study smarter with spaced repetition flashcards",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SpacedRepProvider>
            <SplashScreen />
            <StarBackground />
            <div className="min-h-screen flex flex-col">
              <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto p-4 flex justify-between items-center">
                  <h1 className="font-bold text-xl relative">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
                      SpaceRep
                    </span>
                  </h1>
                  <ModeToggle />
                </div>
              </header>
              <main className="flex-1">{children}  </main>
            </div>
            <Toaster />
          </SpacedRepProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
