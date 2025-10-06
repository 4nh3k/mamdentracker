"use client"

import { useGame } from "@/contexts/game-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, TrendingUp, AlertTriangle, RotateCcw, Users, TrendingDown, Trash2 } from "lucide-react"

export function GameHistory() {
  const { history, clearHistory } = useGame()

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "score":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "fault":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "reset":
        return <RotateCcw className="h-4 w-4 text-muted-foreground" />
      case "take-from-all":
        return <Users className="h-4 w-4 text-blue-500" />
      case "double-loser":
        return <TrendingDown className="h-4 w-4 text-purple-500" />
      default:
        return null
    }
  }

  return (
    <Card className="p-6 h-[calc(100vh-12rem)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Game History</h2>
          <Clock className="h-5 w-5 text-muted-foreground" />
        </div>
        {history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearHistory} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <ScrollArea className="h-[calc(100%-3rem)]">
        {history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No actions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((action) => (
              <div key={action.id} className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getIcon(action.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{action.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatTime(action.timestamp)}</p>
                    {action.affectedPlayers.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {action.affectedPlayers.map((affected) => (
                          <div key={affected.playerId} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{affected.playerName}</span>
                            <span
                              className={
                                affected.scoreDelta > 0
                                  ? "text-green-500 font-semibold"
                                  : affected.scoreDelta < 0
                                    ? "text-destructive font-semibold"
                                    : "text-muted-foreground"
                              }
                            >
                              {affected.scoreDelta > 0 && "+"}
                              {affected.scoreDelta}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  )
}
