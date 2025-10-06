"use client"

import { Settings, PlayCircle, BookOpen, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGame } from "@/contexts/game-context"
import { useLanguage, useTranslation } from "@/contexts/language-context"
import { useState } from "react"
import { InstructionsModal } from "@/components/instructions-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface GameHeaderProps {
  onOpenSetup: () => void
}

export function GameHeader({ onOpenSetup }: GameHeaderProps) {
  const { startNewGame } = useGame()
  const { language, setLanguage } = useLanguage()
  const t = useTranslation()
  const [showInstructions, setShowInstructions] = useState(false)

  return (
    <>
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t("GAME_MANAGER")}</h1>
              <p className="text-sm text-muted-foreground">{t("CIRCULAR_QUEUE_SCORING")}</p>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10 bg-transparent">
                    <Languages className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLanguage("vi")}>🇻🇳 Tiếng Việt</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("en")}>🇬🇧 English</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm" onClick={() => setShowInstructions(true)} className="bg-transparent">
                <BookOpen className="h-4 w-4 mr-2" />
                {t("INSTRUCTIONS")}
              </Button>

              <Button variant="outline" size="sm" onClick={startNewGame} className="bg-transparent">
                <PlayCircle className="h-4 w-4 mr-2" />
                {t("NEW_GAME")}
              </Button>
              <Button variant="outline" size="icon" onClick={onOpenSetup} className="h-10 w-10 bg-transparent">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <InstructionsModal open={showInstructions} onClose={() => setShowInstructions(false)} />
    </>
  )
}
