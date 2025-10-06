"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import { useGame, type ScoringPreset } from "@/contexts/game-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useTranslation } from "@/contexts/language-context"

interface SetupModalProps {
  open: boolean
  onClose: () => void
}

const presetConfigs = {
  "3-6-9": { label: "3-6-9", points: [1, 2, 3] },
  "5-9": { label: "5-9", points: [1, 2] },
  "5-10": { label: "5-10", points: [1, 2] },
  "4-7-10": { label: "4-7-10", points: [1, 2, 3] },
  custom: { label: "Custom", points: [1, 2, 3] },
}

export function SetupModal({ open, onClose }: SetupModalProps) {
  const { players, scoringConfig, settings, addPlayer, removePlayer, setScoringConfig, updateSettings, startGame } =
    useGame()
  const t = useTranslation()

  const [newPlayerName, setNewPlayerName] = useState("")
  const [selectedPreset, setSelectedPreset] = useState<ScoringPreset>(scoringConfig.preset)
  const [customPoints, setCustomPoints] = useState<number[]>(scoringConfig.points)

  useEffect(() => {
    setSelectedPreset(scoringConfig.preset)
    setCustomPoints(scoringConfig.points)
  }, [scoringConfig])

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim())
      setNewPlayerName("")
    }
  }

  const handlePresetChange = (preset: ScoringPreset) => {
    setSelectedPreset(preset)
    if (preset !== "custom") {
      const config = presetConfigs[preset]
      setCustomPoints(config.points)
      setScoringConfig({ preset, points: config.points })
    }
  }

  const handleCustomPointChange = (index: number, value: string) => {
    const numValue = Number.parseInt(value) || 0
    const newPoints = [...customPoints]
    newPoints[index] = numValue
    setCustomPoints(newPoints)
    setScoringConfig({ preset: "custom", points: newPoints })
  }

  const handleStartGame = () => {
    if (players.length >= 2) {
      startGame()
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t("GAME_SETUP")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{t("PLAYERS")}</h3>
              <p className="text-sm text-muted-foreground">{t("ADD_AT_LEAST_PLAYERS")}</p>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder={t("PLAYER_NAME")}
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddPlayer()}
                className="flex-1"
              />
              <Button onClick={handleAddPlayer} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {players.map((player, index) => (
                <div key={player.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{player.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removePlayer(player.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{t("SCORING_SYSTEM")}</h3>
              <p className="text-sm text-muted-foreground">{t("CHOOSE_PRESET")}</p>
            </div>

            <div className="space-y-2">
              <Label>{t("PRESET")}</Label>
              <Select value={selectedPreset} onValueChange={handlePresetChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(presetConfigs).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPreset === "custom" && (
              <div className="space-y-2">
                <Label>{t("CUSTOM_POINTS")}</Label>
                <div className="flex gap-2">
                  {customPoints.map((point, index) => (
                    <Input
                      key={index}
                      type="number"
                      min="1"
                      value={point}
                      onChange={(e) => handleCustomPointChange(index, e.target.value)}
                      className="w-20"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm">
                <span className="font-semibold">{t("POINTS")}: </span>
                {customPoints.join(", ")}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{t("GAME_SETTINGS")}</h3>
              <p className="text-sm text-muted-foreground">{t("CONFIGURE_SPECIAL_ACTIONS")}</p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div className="space-y-0.5">
                <Label htmlFor="double-loser" className="text-base">
                  {t("DOUBLE_LOSER_SCORE")}
                </Label>
                <p className="text-sm text-muted-foreground">{t("ENABLE_DOUBLE_ACTION")}</p>
              </div>
              <Switch
                id="double-loser"
                checked={settings.enableDoubleLoser}
                onCheckedChange={(checked) => updateSettings({ enableDoubleLoser: checked })}
              />
            </div>
          </div>

          <Button onClick={handleStartGame} disabled={players.length < 2} className="w-full" size="lg">
            {t("START_GAME")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
