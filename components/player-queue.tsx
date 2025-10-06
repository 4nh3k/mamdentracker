"use client"

import { useGame } from "@/contexts/game-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, AlertTriangle, Users, TrendingDown } from "lucide-react"
import { useTranslation } from "@/contexts/language-context"

export function PlayerQueue() {
  const {
    players,
    scoringConfig,
    selectedPlayerId,
    settings,
    doubleMultiplier,
    selectPlayer,
    recordScore,
    recordTakeFromAll,
    toggleDoubleMultiplier,
    recordFault,
  } = useGame()

  const t = useTranslation()

  if (players.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">{t("ADD_AT_LEAST_PLAYERS")}</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{t("PLAYER_QUEUE")}</h2>
        <Trophy className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        {players.map((player, index) => {
          const isSelected = selectedPlayerId === player.id
          return (
            <div key={player.id}>
              <button
                onClick={() => selectPlayer(isSelected ? null : player.id)}
                className={`w-full flex items-center justify-between p-5 rounded-lg transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                    : "bg-muted hover:bg-muted/80 active:scale-[0.98]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold ${
                      isSelected ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-lg">{player.name}</p>
                    <p className={`text-sm ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {index === 0 ? t("CURRENT_PLAYER") : `${t("POSITION")} ${index + 1}`}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold">{player.score}</p>
                  <p className={`text-xs ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {t("POINTS")}
                  </p>
                </div>
              </button>

              {isSelected && (
                <div className="mt-3 p-4 bg-card border rounded-lg animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {scoringConfig.points.map((points, idx) => (
                        <Button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation()
                            recordScore(player.id, points)
                          }}
                          size="lg"
                          className="h-16 text-xl font-bold"
                        >
                          +{points}
                        </Button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-medium px-1">{t("SPECIAL_ACTIONS")}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {scoringConfig.points.map((points, idx) => (
                          <Button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation()
                              recordTakeFromAll(player.id, points)
                            }}
                            variant="secondary"
                            size="lg"
                            className="h-14 flex flex-col gap-0.5 py-2"
                          >
                            <Users className="h-3.5 w-3.5" />
                            <span className="text-base font-bold">+{points}</span>
                            <span className="text-[9px] leading-none">{t("FROM_ALL")}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {settings.enableDoubleLoser && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleDoubleMultiplier()
                        }}
                        variant={doubleMultiplier ? "default" : "outline"}
                        size="lg"
                        className={`w-full h-12 ${
                          doubleMultiplier
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                            : "bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20"
                        }`}
                      >
                        <TrendingDown className="h-4 w-4 mr-2" />
                        {doubleMultiplier ? t("MULTIPLIER_ACTIVE") : t("ENABLE_MULTIPLIER")}
                      </Button>
                    )}

                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        recordFault(player.id)
                      }}
                      variant="destructive"
                      size="lg"
                      className="w-full h-12"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      {t("FAULT")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
