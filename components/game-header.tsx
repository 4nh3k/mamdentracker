"use client"

import { Settings, PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGame } from "@/contexts/game-context"

interface GameHeaderProps {
  onOpenSetup: () => void
}

export function GameHeader({ onOpenSetup }: GameHeaderProps) {
  const { startNewGame } = useGame()

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Game Manager</h1>
            <p className="text-sm text-muted-foreground">Circular queue scoring system</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={startNewGame} className="bg-transparent">
              <PlayCircle className="h-4 w-4 mr-2" />
              New Game
            </Button>
            <Button variant="outline" size="icon" onClick={onOpenSetup} className="h-10 w-10 bg-transparent">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
