"use client"

import { useGame } from "@/contexts/game-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { useTranslation } from "@/contexts/language-context"

export function ScoreControls() {
  const { players, resetAllPlayers } = useGame()
  const t = useTranslation()

  if (players.length === 0) {
    return null
  }

  return (
    <Card className="p-6">
      <Button onClick={resetAllPlayers} variant="outline" size="lg" className="w-full h-14 bg-transparent">
        <RotateCcw className="h-4 w-4 mr-2" />
        {t("RESET_ALL_SCORES")}
      </Button>
    </Card>
  )
}
