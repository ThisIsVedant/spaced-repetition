"use client"

import { useState } from "react"
import { FancyTitle } from "./fancy-title"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Paintbrush } from "lucide-react"

type TitleStyle = "neon" | "glitch" | "comic" | "gradient" | "retro" | "outlined"

export function TitleSwitcher() {
  const [style, setStyle] = useState<TitleStyle>("comic")

  const styles: { value: TitleStyle; label: string }[] = [
    { value: "comic", label: "Comic Style" },
    { value: "neon", label: "Neon Glow" },
    { value: "glitch", label: "Glitch Effect" },
    { value: "gradient", label: "Gradient" },
    { value: "retro", label: "Retro" },
    { value: "outlined", label: "Outlined" },
  ]

  return (
    <div className="flex flex-col items-center gap-4">
      <FancyTitle text="SpaceRep" style={style} className="text-4xl" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Paintbrush className="h-4 w-4" />
            <span>Change Style</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {styles.map((styleOption) => (
            <DropdownMenuItem
              key={styleOption.value}
              onClick={() => setStyle(styleOption.value)}
              className={style === styleOption.value ? "bg-primary/10" : ""}
            >
              {styleOption.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
