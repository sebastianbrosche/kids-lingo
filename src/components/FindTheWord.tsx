import { useState, useCallback, useRef } from 'react'
import confetti from 'canvas-confetti'
import { Language, VocabItem } from '@/types'
import { useSpeech } from '@/hooks/useSpeech'

interface Props {
  language: Language
  onBack: () => void
}

interface Round {
  target: VocabItem
  items: PlacedItem[] // everything on screen this round, target included
}

interface PlacedItem extends VocabItem {
  left: number // 0-100, percentage position in the play area
  top: number // 0-100
  rotate: number // small tilt so the scene feels playful and busy
  scale: number // slight size variation
}

function shuffle<T>(array: T[]): T[] {
  const a = [...array]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// How many emoji are on screen at once. This is the "busy scene" knob:
// fewer = easier for younger kids, more = harder. Single-emoji words only
// (we skip the funny phrases here, since a sentence has no single icon to hunt for).
const ITEMS_PER_ROUND = 9

// Scatter items onto a loose grid, then jitter each one so the layout looks
// hand-strewn rather than tabular. The grid keeps things from overlapping too much.
function placeItems(items: VocabItem[]): PlacedItem[] {
  const n = items.length
  const cols = Math.ceil(Math.sqrt(n))
  const rows = Math.ceil(n / cols)
  const cellW = 100 / cols
  const cellH = 100 / rows

  return items.map((item, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    // center of the cell, plus a jitter of up to ~35% of the cell in each direction
    const jitterX = (Math.random() - 0.5) * cellW * 0.7
    const jitterY = (Math.random() - 0.5) * cellH * 0.7
    return {
      ...item,
      left: cellW * (col + 0.5) + jitterX,
      top: cellH * (row + 0.5) + jitterY,
      rotate: (Math.random() - 0.5) * 30,
      scale: 0.85 + Math.random() * 0.35,
    }
  })
}

function generateRounds(vocab: VocabItem[]): Round[] {
  // Only hunt for things that have a single, findable emoji.
  const findable = vocab.filter((v) => v.category !== 'funny')
  const pool = shuffle(findable)

  return pool.map((target) => {
    const distractors = shuffle(findable.filter((v) => v.id !== target.id)).slice(
      0,
      ITEMS_PER_ROUND - 1
    )
    const items = placeItems(shuffle([target, ...distractors]))
    return { target, items }
  })
}

export default function FindTheWord({ language, onBack }: Props) {
  const { speak } = useSpeech()
  const [rounds, setRounds] = useState<Round[]>(() => generateRounds(language.vocab))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [wrongId, setWrongId] = useState<string | null>(null)
  const [foundId, setFoundId] = useState<string | null>(null)
  const [locked, setLocked] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const audioPlayed = useRef(false)

  const currentRound = rounds[currentIndex]
  const progress = (currentIndex / rounds.length) * 100

  const playTargetWord = useCallback(() => {
    if (!currentRound) return
    speak(currentRound.target.word, currentRound.target.audioLang || 'en-US')
  }, [currentRound, speak])

  // Auto-play removed: user clicks "Listen!" when ready.

  const advance = useCallback(() => {
    if (currentIndex + 1 >= rounds.length) {
      setGameOver(true)
    } else {
      setCurrentIndex((i) => i + 1)
      setFoundId(null)
      setWrongId(null)
      setLocked(false)
      audioPlayed.current = false
    }
  }, [currentIndex, rounds.length])

  const handlePick = useCallback(
    (item: PlacedItem) => {
      if (locked || !currentRound) return

      if (item.id === currentRound.target.id) {
        setLocked(true)
        setFoundId(item.id)
        setScore((s) => s + 1)
        setStreak((s) => {
          const next = s + 1
          if (next > bestStreak) setBestStreak(next)
          return next
        })
        confetti({
          particleCount: 70,
          spread: 75,
          origin: { y: 0.5 },
          colors: ['#FFD93D', '#FF8C42', '#69F0AE', '#4FC3F7', '#FF6B9D'],
        })
        // Repeat the word they just found, in the target language, to reinforce it.
        speak(item.word, item.audioLang || 'en-US')
        setTimeout(advance, 1400)
      } else {
        // Wrong tap is a gentle nudge, never a penalty: wiggle it, replay the word.
        setWrongId(item.id)
        setStreak(0)
        speak(currentRound.target.word, currentRound.target.audioLang || 'en-US')
        setTimeout(() => setWrongId(null), 500)
      }
    },
    [currentRound, locked, bestStreak, advance, speak]
  )

  const handleReplay = useCallback(() => {
    setRounds(generateRounds(language.vocab))
    setCurrentIndex(0)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setFoundId(null)
    setWrongId(null)
    setLocked(false)
    setGameOver(false)
    audioPlayed.current = false
  }, [language.vocab])

  if (gameOver) {
    const percentage = Math.round((score / rounds.length) * 100)
    const stars = percentage >= 80 ? 3 : percentage >= 50 ? 2 : 1

    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <h2 className="mb-4 text-4xl font-bold text-kids-brown md:text-6xl">
          You did it!
        </h2>
        <div className="mb-6 flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className={`text-5xl md:text-6xl transition-all ${
                i < stars ? 'animate-pop' : 'opacity-30 grayscale'
              }`}
              style={{ animationDelay: `${i * 200}ms` }}
            >
              ⭐
            </span>
          ))}
        </div>
        <div className="mb-8 grid w-full max-w-xs grid-cols-2 gap-4 text-center">
          <div className="rounded-2xl bg-white p-4 shadow-md">
            <div className="text-3xl font-bold text-kids-brown">
              {score}/{rounds.length}
            </div>
            <div className="text-sm text-kids-brown/60">Found</div>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-md">
            <div className="text-3xl font-bold text-kids-brown">{bestStreak}</div>
            <div className="text-sm text-kids-brown/60">Best Streak</div>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleReplay}
            className="rounded-full bg-kids-purple px-8 py-4 text-xl font-bold text-kids-brown shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            🔄 Play Again
          </button>
          <button
            onClick={onBack}
            className="rounded-full bg-white px-8 py-4 text-xl font-bold text-kids-brown shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            🏠 Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-full bg-white px-4 py-2 font-bold text-kids-brown shadow-md transition-all hover:scale-105 active:scale-95"
        >
          🔙
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-2xl">🔥</span>
            <span className="text-xl font-bold text-kids-brown">{streak}</span>
          </div>
          <div className="rounded-full bg-white px-4 py-2 font-bold text-kids-brown shadow-md">
            {score}/{rounds.length}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-white shadow-inner">
        <div
          className="h-full rounded-full bg-kids-purple transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* The word to find: shown as text AND spoken, so reading and listening reinforce each other */}
      <div className="mb-4 flex flex-col items-center gap-2">
        <button
          onClick={playTargetWord}
          className="flex items-center gap-3 rounded-full bg-kids-purple px-8 py-4 text-2xl font-bold text-kids-brown shadow-lg transition-all hover:scale-105 active:scale-95 md:text-3xl"
        >
          <span className="text-3xl">🔊</span>
          <span>Find: {currentRound?.target.word}</span>
        </button>
      </div>

      {/* Busy scatter scene */}
      <div className="relative flex-1 overflow-hidden rounded-3xl border-4 border-kids-purple bg-kids-cream shadow-lg">
        {currentRound?.items.map((item) => {
          const isFound = foundId === item.id
          const isWrong = wrongId === item.id
          return (
            <button
              key={item.id}
              onClick={() => handlePick(item)}
              disabled={locked}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform ${
                isWrong ? 'animate-shake' : ''
              } ${isFound ? 'z-10' : ''}`}
              style={{
                left: `${item.left}%`,
                top: `${item.top}%`,
                transform: `translate(-50%, -50%) rotate(${item.rotate}deg) scale(${
                  isFound ? 1.4 : item.scale
                })`,
              }}
              aria-label={item.word}
            >
              <span className="text-4xl drop-shadow-sm md:text-6xl">{item.emoji}</span>
              {isFound && (
                <span className="absolute -right-2 -top-2 text-3xl md:text-4xl">🎉</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Hint */}
      <p className="mt-4 text-center text-sm text-kids-brown/50">
        Tap the picture that matches the word you hear!
      </p>
    </div>
  )
}
