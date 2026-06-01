import { useState, useCallback, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { Language, VocabItem } from '@/types'
import { useSpeech } from '@/hooks/useSpeech'

interface Props {
  language: Language
  onBack: () => void
}

interface Round {
  target: VocabItem
  choices: VocabItem[]
}

function shuffle<T>(array: T[]): T[] {
  const a = [...array]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateRounds(vocab: VocabItem[]): Round[] {
  const pool = shuffle(vocab)
  const rounds: Round[] = []

  for (const target of pool) {
    const distractors = shuffle(vocab.filter((v) => v.id !== target.id)).slice(0, 3)
    const choices = shuffle([target, ...distractors])
    rounds.push({ target, choices })
  }

  return shuffle(rounds)
}

export default function FlashCardGame({ language, onBack }: Props) {
  const { speak } = useSpeech()
  const [rounds, setRounds] = useState<Round[]>(() => generateRounds(language.vocab))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [bestStreak, setBestStreak] = useState(0)
  const audioPlayed = useRef(false)

  const currentRound = rounds[currentIndex]
  const progress = ((currentIndex) / rounds.length) * 100

  const playTargetWord = useCallback(() => {
    if (!currentRound) return
    speak(currentRound.target.word, currentRound.target.audioLang || 'en-US')
  }, [currentRound, speak])

  useEffect(() => {
    if (currentRound && !audioPlayed.current && !showResult && !gameOver) {
      audioPlayed.current = true
      const timer = setTimeout(() => {
        playTargetWord()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentRound, playTargetWord, showResult, gameOver])

  const handleCardClick = useCallback(
    (item: VocabItem) => {
      if (showResult || !currentRound) return

      setSelectedId(item.id)
      const correct = item.id === currentRound.target.id
      setIsCorrect(correct)
      setShowResult(true)

      if (correct) {
        setScore((s) => s + 1)
        setStreak((s) => {
          const newStreak = s + 1
          if (newStreak > bestStreak) setBestStreak(newStreak)
          return newStreak
        })
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD93D', '#FF8C42', '#69F0AE', '#4FC3F7', '#FF6B9D'],
        })
        // Reinforce by repeating the target word in the language being learned.
        // (No English praise voice line: it would crowd out the target language,
        // and the confetti + green card already say "yes" loud and clear.)
        speak(item.word, item.audioLang || 'en-US')
      } else {
        setStreak(0)
        // On a miss, replay the word they were listening for so the sound sticks.
        speak(currentRound.target.word, currentRound.target.audioLang || 'en-US')
      }

      setTimeout(() => {
        if (currentIndex + 1 >= rounds.length) {
          setGameOver(true)
        } else {
          setCurrentIndex((i) => i + 1)
          setSelectedId(null)
          setIsCorrect(null)
          setShowResult(false)
          audioPlayed.current = false
        }
      }, 1500)
    },
    [currentRound, currentIndex, rounds.length, showResult, speak, bestStreak]
  )

  const handleReplay = useCallback(() => {
    const newRounds = generateRounds(language.vocab)
    setRounds(newRounds)
    setCurrentIndex(0)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setSelectedId(null)
    setIsCorrect(null)
    setShowResult(false)
    setGameOver(false)
    audioPlayed.current = false
  }, [language.vocab])

  const getCardStyle = (item: VocabItem): string => {
    const base =
      'relative flex flex-col items-center justify-center gap-2 rounded-3xl border-4 p-4 shadow-lg transition-all md:gap-4 md:p-6 '

    if (!showResult) {
      return (
        base +
        'bg-white border-white hover:scale-105 hover:shadow-xl active:scale-95 cursor-pointer'
      )
    }

    if (item.id === currentRound?.target.id) {
      return base + 'bg-kids-green border-kids-green scale-105'
    }

    if (item.id === selectedId && !isCorrect) {
      return base + 'bg-kids-red border-kids-red animate-shake'
    }

    return base + 'bg-white/50 border-white/50 opacity-50'
  }

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'animals':
        return 'bg-kids-yellow'
      case 'food':
        return 'bg-kids-orange'
      case 'funny':
        return 'bg-kids-pink'
      default:
        return 'bg-kids-blue'
    }
  }

  if (gameOver) {
    const percentage = Math.round((score / rounds.length) * 100)
    const stars = percentage >= 80 ? 3 : percentage >= 50 ? 2 : 1

    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <h2 className="mb-4 text-4xl font-bold text-kids-brown md:text-6xl">
          Game Over!
        </h2>

        <div className="mb-6 flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className={`text-5xl md:text-6xl transition-all ${
                i < stars ? 'animate-pop' : 'grayscale opacity-30'
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
            <div className="text-sm text-kids-brown/60">Correct</div>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-md">
            <div className="text-3xl font-bold text-kids-brown">
              {bestStreak}
            </div>
            <div className="text-sm text-kids-brown/60">Best Streak</div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleReplay}
            className="rounded-full bg-kids-green px-8 py-4 text-xl font-bold text-kids-brown shadow-lg transition-all hover:scale-105 active:scale-95"
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
          className="h-full rounded-full bg-kids-green transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Listen button */}
      <div className="mb-4 flex justify-center">
        <button
          onClick={playTargetWord}
          disabled={showResult}
          className={`flex items-center gap-3 rounded-full px-8 py-4 text-2xl font-bold shadow-lg transition-all md:text-3xl ${
            showResult
              ? 'bg-white/50 text-kids-brown/30'
              : `${getCategoryColor(currentRound?.target.category || '')} text-kids-brown hover:scale-105 active:scale-95`
          }`}
        >
          <span className="text-3xl">🔊</span>
          <span>Listen!</span>
        </button>
      </div>

      {/* Cards grid */}
      <div className="flex flex-1 items-center justify-center">
        <div className="grid w-full max-w-lg grid-cols-2 gap-4">
          {currentRound?.choices.map((item) => (
            <button
              key={item.id}
              onClick={() => handleCardClick(item)}
              disabled={showResult}
              className={getCardStyle(item)}
            >
              <span className="text-5xl md:text-7xl">{item.emoji}</span>
              <span className="text-center text-sm font-bold text-kids-brown md:text-base">
                {item.word}
              </span>
              {showResult && item.id === currentRound.target.id && (
                <span className="absolute -right-2 -top-2 text-4xl md:text-5xl">
                  🎉
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Result message */}
      {showResult && (
        <div className="mt-4 text-center">
          <span
            className={`text-2xl font-bold md:text-3xl ${
              isCorrect ? 'text-kids-green' : 'text-kids-red'
            }`}
          >
            {isCorrect ? '🎉 Correct!' : '❌ Oops!'}
          </span>
        </div>
      )}
    </div>
  )
}
