"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, type Language } from "@/lib/translations"

export type ScoringPreset = "3-6-9" | "5-9" | "5-10" | "4-7-10" | "custom"

export interface ScoringConfig {
  preset: ScoringPreset
  points: number[]
}

export interface Player {
  id: string
  name: string
  score: number
}

export interface GameAction {
  id: string
  timestamp: number
  type: "score" | "fault" | "reset" | "take-from-all" | "double-loser"
  description: string
  affectedPlayers: {
    playerId: string
    playerName: string
    scoreDelta: number
  }[]
  snapshot: {
    players: Player[]
    doubleMultiplier: boolean
  }
}

export interface GameSettings {
  enableDoubleLoser: boolean
}

interface GameState {
  players: Player[]
  scoringConfig: ScoringConfig
  history: GameAction[]
  isGameActive: boolean
  selectedPlayerId: string | null
  settings: GameSettings
  doubleMultiplier: boolean
  lastRollbackIndex: number | null
}

interface GameContextType extends GameState {
  addPlayer: (name: string) => void
  removePlayer: (id: string) => void
  setScoringConfig: (config: ScoringConfig) => void
  recordScore: (playerId: string, points: number) => void
  recordTakeFromAll: (playerId: string, points: number) => void
  recordDoubleLoser: () => void
  recordFault: (playerId: string) => void
  resetAllPlayers: () => void
  startGame: () => void
  selectPlayer: (playerId: string | null) => void
  updateSettings: (settings: Partial<GameSettings>) => void
  clearHistory: () => void
  startNewGame: () => void
  toggleDoubleMultiplier: () => void
  rollbackToAction: (actionId: string) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

const STORAGE_KEY = "game-management-state"
const LANGUAGE_PREF_KEY = "game-language"

const getLang = (): Language => {
  try {
    const stored = localStorage.getItem(LANGUAGE_PREF_KEY)
    return stored === "en" ? "en" : "vi"
  } catch (e) {
    return "vi"
  }
}

const defaultScoringConfigs: Record<ScoringPreset, number[]> = {
  "3-6-9": [1, 2, 3],
  "5-9": [1, 2],
  "5-10": [1, 2],
  "4-7-10": [1, 2, 3],
  custom: [1, 2, 3],
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    scoringConfig: {
      preset: "3-6-9",
      points: [1, 2, 3],
    },
    history: [],
    isGameActive: false,
    selectedPlayerId: null,
    settings: {
      enableDoubleLoser: false,
    },
    doubleMultiplier: false,
    lastRollbackIndex: null,
  })

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setGameState({
          players: parsed.players || [],
          scoringConfig: parsed.scoringConfig || {
            preset: "3-6-9",
            points: [1, 2, 3],
          },
          history: parsed.history || [],
          isGameActive: parsed.isGameActive || false,
          selectedPlayerId: parsed.selectedPlayerId || null,
          settings: {
            enableDoubleLoser: parsed.settings?.enableDoubleLoser ?? false,
          },
          doubleMultiplier: parsed.doubleMultiplier || false,
          lastRollbackIndex: parsed.lastRollbackIndex || null,
        })
      } catch (e) {
        console.error("[v0] Failed to parse stored game state:", e)
      }
    }
  }, [])

  useEffect(() => {
    if (gameState.isGameActive) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState))
    }
  }, [gameState])

  const addPlayer = (name: string) => {
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name,
      score: 0,
    }
    setGameState((prev) => ({
      ...prev,
      players: [...prev.players, newPlayer],
    }))
  }

  const removePlayer = (id: string) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== id),
      selectedPlayerId: prev.selectedPlayerId === id ? null : prev.selectedPlayerId,
    }))
  }

  const setScoringConfig = (config: ScoringConfig) => {
    setGameState((prev) => ({
      ...prev,
      scoringConfig: config,
    }))
  }

  const recordScore = (playerId: string, points: number) => {
    setGameState((prev) => {
      const players = [...prev.players]
      const scorerIndex = players.findIndex((p) => p.id === playerId)
      if (scorerIndex === -1) return prev

      const scorer = players[scorerIndex]
      const previousPlayerIndex = scorerIndex === 0 ? players.length - 1 : scorerIndex - 1
      const previousPlayer = players[previousPlayerIndex]

      const actualPoints = prev.doubleMultiplier ? points * 2 : points

      scorer.score += actualPoints
      previousPlayer.score -= actualPoints

      const lang = getLang()
      const scoredText = translations[lang]["SCORED"]
      const pointText = actualPoints === 1 ? translations[lang]["POINT"] : translations[lang]["POINTS_PLURAL"]
      const doubledText = prev.doubleMultiplier ? ` ${translations[lang]["DOUBLED"]}` : ""

      const action: GameAction = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: "score",
        description: `${scorer.name} ${scoredText} ${actualPoints} ${pointText}(${doubledText})`,
        affectedPlayers: [
          { playerId: scorer.id, playerName: scorer.name, scoreDelta: actualPoints },
          { playerId: previousPlayer.id, playerName: previousPlayer.name, scoreDelta: -actualPoints },
        ],
        snapshot: {
          players: players.map((p) => ({ ...p })),
          doubleMultiplier: false,
        },
      }

      return {
        ...prev,
        players,
        history: [action, ...prev.history],
        doubleMultiplier: false,
        lastRollbackIndex: null,
      }
    })
  }

  const recordTakeFromAll = (playerId: string, points: number) => {
    setGameState((prev) => {
      const players = [...prev.players]
      const scorer = players.find((p) => p.id === playerId)
      if (!scorer) return prev

      const otherPlayers = players.filter((p) => p.id !== playerId)

      const actualPoints = prev.doubleMultiplier ? points * 2 : points
      const totalGain = actualPoints * otherPlayers.length

      scorer.score += totalGain

      otherPlayers.forEach((player) => {
        player.score -= actualPoints
      })

      const lang = getLang()
      const tookText = translations[lang]["TOOK_FROM"]
      const fromAllText = translations[lang]["FROM_ALL_PLAYERS"]
      const pointText = actualPoints === 1 ? translations[lang]["POINT"] : translations[lang]["POINTS_PLURAL"]
      const doubledText = prev.doubleMultiplier ? ` ${translations[lang]["DOUBLED"]}` : ""

      const action: GameAction = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: "take-from-all",
        description: `${scorer.name} ${tookText} ${actualPoints} ${pointText} ${fromAllText}${doubledText}`,
        affectedPlayers: [
          { playerId: scorer.id, playerName: scorer.name, scoreDelta: totalGain },
          ...otherPlayers.map((p) => ({
            playerId: p.id,
            playerName: p.name,
            scoreDelta: -actualPoints,
          })),
        ],
        snapshot: {
          players: players.map((p) => ({ ...p })),
          doubleMultiplier: false,
        },
      }

      return {
        ...prev,
        players,
        history: [action, ...prev.history],
        doubleMultiplier: false,
        lastRollbackIndex: null,
      }
    })
  }

  const recordDoubleLoser = () => {
    setGameState((prev) => ({
      ...prev,
      doubleMultiplier: !prev.doubleMultiplier,
    }))
  }

  const recordFault = (playerId: string) => {
    setGameState((prev) => {
      const players = [...prev.players]
      const n = players.length
      const faultyPlayerIndex = players.findIndex((p) => p.id === playerId)
      if (faultyPlayerIndex === -1) return prev
      if (n < 2) return prev

      const faultyPlayer = players[faultyPlayerIndex]

      // previous player index in the original ordering
      const previousPlayerIndex = faultyPlayerIndex === 0 ? n - 1 : faultyPlayerIndex - 1

      // Build rotated list: start from previous player, then follow circularly
      // adding all non-faulty players, and finally the faulty player at the end.
      const rotatedPlayers: Player[] = []
      rotatedPlayers.push(players[previousPlayerIndex])

      // add the remaining n-1 non-faulty players in circular order
      let count = 0
      let idx = (previousPlayerIndex + 1) % n
      while (count < n - 1) {
        if (idx !== faultyPlayerIndex) {
          rotatedPlayers.push(players[idx])
        }
        idx = (idx + 1) % n
        count++
      }

      // finally push the faulty player to the end
      rotatedPlayers.push(faultyPlayer)

      const lang = getLang()
      const faultedText = translations[lang]["FAULTED"]

      const action: GameAction = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: "fault",
        description: `${faultyPlayer.name} ${faultedText}`,
        affectedPlayers: [{ playerId: faultyPlayer.id, playerName: faultyPlayer.name, scoreDelta: 0 }],
        snapshot: {
          players: rotatedPlayers.map((p) => ({ ...p })),
          doubleMultiplier: prev.doubleMultiplier,
        },
      }

      return {
        ...prev,
        players: rotatedPlayers,
        history: [action, ...prev.history],
      }
    })
  }


  const resetAllPlayers = () => {
    setGameState((prev) => {
      const lang = getLang()
      const allResetText = translations[lang]["ALL_SCORES_RESET"]

      const action: GameAction = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: "reset",
        description: allResetText,
        affectedPlayers: prev.players.map((p) => ({
          playerId: p.id,
          playerName: p.name,
          scoreDelta: -p.score,
        })),
        snapshot: {
          players: prev.players.map((p) => ({ ...p })),
          doubleMultiplier: prev.doubleMultiplier,
        },
      }

      return {
        ...prev,
        players: prev.players.map((p) => ({ ...p, score: 0 })),
        history: [action, ...prev.history],
        lastRollbackIndex: null,
      }
    })
  }

  const startGame = () => {
    setGameState((prev) => ({
      ...prev,
      isGameActive: true,
    }))
  }

  const selectPlayer = (playerId: string | null) => {
    setGameState((prev) => ({
      ...prev,
      selectedPlayerId: playerId,
    }))
  }

  const updateSettings = (settings: Partial<GameSettings>) => {
    setGameState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
    }))
  }

  const clearHistory = () => {
    setGameState((prev) => ({
      ...prev,
      history: [],
    }))
  }

  const startNewGame = () => {
    setGameState((prev) => {
      const lang = getLang()
      const newGameText = translations[lang]["NEW_GAME_STARTED"]

      const action: GameAction = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: "reset",
        description: newGameText,
        affectedPlayers: prev.players.map((p) => ({
          playerId: p.id,
          playerName: p.name,
          scoreDelta: -p.score,
        })),
        snapshot: {
          players: prev.players.map((p) => ({ ...p })),
          doubleMultiplier: prev.doubleMultiplier,
        },
      }

      return {
        ...prev,
        players: prev.players.map((p) => ({ ...p, score: 0 })),
        history: [action, ...prev.history],
        selectedPlayerId: null,
        lastRollbackIndex: null,
      }
    })
  }

  const toggleDoubleMultiplier = () => {
    setGameState((prev) => ({
      ...prev,
      doubleMultiplier: !prev.doubleMultiplier,
    }))
  }

  const rollbackToAction = (actionId: string) => {
    setGameState((prev) => {
      const actionIndex = prev.history.findIndex((a) => a.id === actionId)
      if (actionIndex === -1) return prev

      const action = prev.history[actionIndex]

      if (!action.snapshot || !action.snapshot.players) {
        console.error("[v0] Cannot rollback: action snapshot is missing or invalid")
        return prev
      }

      return {
        ...prev,
        players: action.snapshot.players.map((p) => ({ ...p })),
        doubleMultiplier: action.snapshot.doubleMultiplier,
        lastRollbackIndex: actionIndex,
      }
    })
  }

  return (
    <GameContext.Provider
      value={{
        ...gameState,
        addPlayer,
        removePlayer,
        setScoringConfig,
        recordScore,
        recordTakeFromAll,
        recordDoubleLoser,
        recordFault,
        resetAllPlayers,
        startGame,
        selectPlayer,
        updateSettings,
        clearHistory,
        startNewGame,
        toggleDoubleMultiplier,
        rollbackToAction,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGame must be used within GameProvider")
  }
  return context
}
