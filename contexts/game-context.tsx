"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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

      const action: GameAction = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: "score",
        description: `${scorer.name} scored ${actualPoints} point${actualPoints !== 1 ? "s" : ""}${prev.doubleMultiplier ? " (doubled)" : ""}`,
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

      const action: GameAction = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: "take-from-all",
        description: `${scorer.name} took ${actualPoints} point${actualPoints !== 1 ? "s" : ""} from all players${prev.doubleMultiplier ? " (doubled)" : ""}`,
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
      const faultyPlayerIndex = players.findIndex((p) => p.id === playerId)
      if (faultyPlayerIndex === -1) return prev

      const faultyPlayer = players[faultyPlayerIndex]

      // Calculate the previous player index (who will become current)
      const previousPlayerIndex = faultyPlayerIndex === 0 ? players.length - 1 : faultyPlayerIndex - 1

      // Remove the faulty player from their position
      players.splice(faultyPlayerIndex, 1)

      // Add them to the end
      players.push(faultyPlayer)

      // Reorder the players:
      // 1. Previous player becomes current (index 0)
      // 2. Keep remaining players after fault position in order
      // 3. Add players before fault position
      // 4. Faulty player goes last (already at the end of players array)
      const beforeFault = players.slice(0, previousPlayerIndex)
      const afterPrevious = players.slice(previousPlayerIndex, players.length - 1)
      const rotatedPlayers = [...afterPrevious, ...beforeFault, faultyPlayer]

      const action: GameAction = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: "fault",
        description: `${faultyPlayer.name} faulted and moved to end of queue`,
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
      const action: GameAction = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: "reset",
        description: "All scores reset to 0",
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
      const action: GameAction = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: "reset",
        description: "New game started - all scores reset",
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
