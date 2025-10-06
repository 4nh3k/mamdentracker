"use client"

import { useState } from "react"
import { GameProvider } from "@/contexts/game-context"
import { LanguageProvider } from "@/contexts/language-context"
import { GameHeader } from "@/components/game-header"
import { PlayerQueue } from "@/components/player-queue"
import { ScoreControls } from "@/components/score-controls"
import { GameHistory } from "@/components/game-history"
import { SetupModal } from "@/components/setup-modal"

export default function GameManagementPage() {
  const [showSetup, setShowSetup] = useState(true)

  return (
    <LanguageProvider>
      <GameProvider>
        <div className="min-h-screen bg-background">
          <GameHeader onOpenSetup={() => setShowSetup(true)} />

          <main className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <PlayerQueue />
                <ScoreControls />
              </div>

              <div>
                <GameHistory />
              </div>
            </div>
          </main>

          <SetupModal open={showSetup} onClose={() => setShowSetup(false)} />
        </div>
      </GameProvider>
    </LanguageProvider>
  )
}
