import { useState, useCallback, useRef } from 'react'
import confetti from 'canvas-confetti'

interface Props {
  onBack: () => void
}

interface DifferenceSpot {
  id: number
  x: number
  y: number
  found: boolean
}

// Predefined scenes with differences
// Each scene has a pair of images (left/right) and hotspot coordinates
const scenes = [
  {
    id: 1,
    name: 'Beach Day',
    emoji: '\uD83C\uDFD6\uFE0F',
    leftImage: 'Scene: A sunny beach with a palm tree, beach ball, sandcastle, umbrella, seagull, starfish, bucket, crab, sun, and ocean waves. Colorful cartoon style.',
    rightImage: 'Same beach scene but: the beach ball is missing, the starfish is green instead of orange, there is a tiny hat on the crab, the bucket has a hole in it, and there is an extra shell in the sand.',
    differences: [
      { id: 1, x: 0.35, y: 0.45, found: false },
      { id: 2, x: 0.65, y: 0.7, found: false },
      { id: 3, x: 0.5, y: 0.8, found: false },
      { id: 4, x: 0.2, y: 0.6, found: false },
      { id: 5, x: 0.8, y: 0.55, found: false },
    ],
  },
  {
    id: 2,
    name: 'Jungle',
    emoji: '\uD83C\uDF34',
    leftImage: 'Scene: A jungle with a monkey on a vine, tiger behind leaves, parrot on a branch, waterfall, bananas hanging, snake coiled on a rock, frog on lily pad, butterfly, and rainbow.',
    rightImage: 'Same jungle scene but: the monkey is holding a banana instead of nothing, the parrot is blue instead of red, there is an extra butterfly, the frog is gone, and the tiger has stripes missing.',
    differences: [
      { id: 1, x: 0.4, y: 0.3, found: false },
      { id: 2, x: 0.7, y: 0.35, found: false },
      { id: 3, x: 0.55, y: 0.5, found: false },
      { id: 4, x: 0.25, y: 0.75, found: false },
      { id: 5, x: 0.6, y: 0.6, found: false },
    ],
  },
]

export default function FindDifferences({ onBack }: Props) {
  const [currentScene, setCurrentScene] = useState(0)
  const [differences, setDifferences] = useState<DifferenceSpot[]>(scenes[0].differences)
  const [foundCount, setFoundCount] = useState(0)
  const [wrongClicks, setWrongClicks] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [clickFeedback, setClickFeedback] = useState<{ x: number; y: number; correct: boolean } | null>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  const scene = scenes[currentScene]

  const handleImageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (gameComplete) return

      const rect = e.currentTarget.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height

      // Check if click is near any unfound difference
      const foundDiff = differences.find(
        (d) =>
          !d.found &&
          Math.abs(d.x - x) < 0.12 &&
          Math.abs(d.y - y) < 0.12
      )

      if (foundDiff) {
        setDifferences((prev) =>
          prev.map((d) => (d.id === foundDiff.id ? { ...d, found: true } : d))
        )
        setFoundCount((c) => {
          const newCount = c + 1
          if (newCount >= scene.differences.length) {
            setGameComplete(true)
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.5 },
              colors: ['#FFD93D', '#FF8C42', '#69F0AE', '#4FC3F7', '#FF6B9D'],
            })
          }
          return newCount
        })
        setClickFeedback({ x: e.clientX, y: e.clientY, correct: true })
      } else {
        setWrongClicks((c) => c + 1)
        setClickFeedback({ x: e.clientX, y: e.clientY, correct: false })
      }

      setTimeout(() => setClickFeedback(null), 600)
    },
    [differences, gameComplete, scene]
  )

  const handleNextScene = useCallback(() => {
    const next = (currentScene + 1) % scenes.length
    setCurrentScene(next)
    setDifferences(scenes[next].differences.map((d) => ({ ...d, found: false })))
    setFoundCount(0)
    setWrongClicks(0)
    setGameComplete(false)
  }, [currentScene])

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

        <div className="flex items-center gap-2 text-xl font-bold text-kids-brown">
          <span>{scene.emoji}</span>
          <span className="hidden md:inline">{scene.name}</span>
        </div>

        <div className="rounded-full bg-white px-4 py-2 font-bold text-kids-brown shadow-md">
          {foundCount}/{scene.differences.length}
        </div>
      </div>

      {/* Game complete overlay */}
      {gameComplete && (
        <div className="mb-4 rounded-2xl bg-kids-green p-4 text-center shadow-lg animate-pop">
          <span className="text-2xl font-bold text-kids-brown">
            🎉 You found them all! {wrongClicks === 0 ? 'Perfect!' : `${wrongClicks} wrong tries`}
          </span>
          <button
            onClick={handleNextScene}
            className="ml-4 rounded-full bg-white px-6 py-2 font-bold text-kids-brown shadow-md transition-all hover:scale-105 active:scale-95"
          >
            Next ▶️
          </button>
        </div>
      )}

      {/* Image comparison area */}
      <div className="relative flex flex-1 flex-col gap-4 md:flex-row" ref={imageRef}>
        {/* Left image */}
        <div
          className="relative flex-1 cursor-crosshair overflow-hidden rounded-2xl border-4 border-kids-blue bg-kids-cream shadow-lg"
          onClick={(e) => handleImageClick(e)}
        >
          <div className="flex h-full flex-col items-center justify-center p-4">
            <span className="mb-2 text-6xl md:text-8xl">{scene.emoji}</span>
            <p className="text-center text-xs text-kids-brown/50 md:text-sm">{scene.leftImage}</p>
            <span className="absolute left-2 top-2 rounded-full bg-kids-blue px-3 py-1 text-sm font-bold text-white">
              LEFT
            </span>
          </div>

          {/* Found markers */}
          {differences
            .filter((d) => d.found)
            .map((d) => (
              <div
                key={`left-${d.id}`}
                className="pointer-events-none absolute flex items-center justify-center"
                style={{
                  left: `${d.x * 100}%`,
                  top: `${d.y * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-kids-green bg-white/80 text-lg font-bold text-kids-green shadow-lg md:h-12 md:w-12">
                  ✓
                </div>
              </div>
            ))}
        </div>

        {/* Right image */}
        <div
          className="relative flex-1 cursor-crosshair overflow-hidden rounded-2xl border-4 border-kids-pink bg-kids-cream shadow-lg"
          onClick={(e) => handleImageClick(e)}
        >
          <div className="flex h-full flex-col items-center justify-center p-4">
            <span className="mb-2 text-6xl md:text-8xl">{scene.emoji}</span>
            <p className="text-center text-xs text-kids-brown/50 md:text-sm">{scene.rightImage}</p>
            <span className="absolute left-2 top-2 rounded-full bg-kids-pink px-3 py-1 text-sm font-bold text-white">
              RIGHT
            </span>
          </div>

          {/* Found markers */}
          {differences
            .filter((d) => d.found)
            .map((d) => (
              <div
                key={`right-${d.id}`}
                className="pointer-events-none absolute flex items-center justify-center"
                style={{
                  left: `${d.x * 100}%`,
                  top: `${d.y * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-kids-green bg-white/80 text-lg font-bold text-kids-green shadow-lg md:h-12 md:w-12">
                  ✓
                </div>
              </div>
            ))}
        </div>

        {/* Click feedback */}
        {clickFeedback && (
          <div
            className="pointer-events-none fixed z-50 text-4xl md:text-5xl"
            style={{
              left: clickFeedback.x,
              top: clickFeedback.y,
              transform: 'translate(-50%, -50%)',
              animation: 'pop 0.5s ease-out forwards',
            }}
          >
            {clickFeedback.correct ? '🎉' : '❌'}
          </div>
        )}
      </div>

      {/* Hint */}
      <p className="mt-4 text-center text-sm text-kids-brown/50">
        Tap the differences between the two pictures!
      </p>
    </div>
  )
}
