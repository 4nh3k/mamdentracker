"use client"

import { useGame } from "@/contexts/game-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

export function ScoreControls() {
  const { players, resetAllPlayers } = useGame()

  if (players.length === 0) {
    return null
  }

  return (
    <Card className="p-6">
      <Button onClick={resetAllPlayers} variant="outline" size="lg" className="w-full h-14 bg-transparent">
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset All Scores
      </Button>
    </Card>
  )
}
