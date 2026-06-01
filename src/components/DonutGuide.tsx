import { useState, useEffect } from 'react'
import { DonutMood, PlayerStats, LOOT_TIER_EMOJIS } from '@/types'
import { getExpToNextLevel } from '@/data/levels'

interface Props {
  mood: DonutMood
  message?: string
  onMessageComplete?: () => void
  stats?: PlayerStats
}

const DONUT_LINES = {
  happy: ['Well done, darling!', 'Simply marvelous!', 'I knew you had it in you.', 'Magnificent!', 'A royal performance!'],
  angry: ['I mean, really!', 'This is an outrage!!', 'Unacceptable!', 'My patience is wearing thin!', 'I expected better!'],
  excited: ['Onward! To glory!', 'The dungeon awaits!', 'Let us conquer this!', 'Tally ho!', 'Adventure calls!'],
  neutral: ['Tap the word you hear.', 'Listen carefully, now.', 'Find the monster.', 'Which one matches?', 'Pay attention, darling.'],
  laser: ['PEW! PEW! PEW!', 'Magic missiles!', 'Take that, beast!', 'ZAP!'],
  puddle: ['*splash*', 'Puddle jump!', 'Teleport!', 'Whoosh!'],
}

export default function DonutGuide({ mood, message, onMessageComplete, stats }: Props) {
  const [showBubble, setShowBubble] = useState(true)
  const [currentLine, setCurrentLine] = useState('')

  useEffect(() => {
    if (message) {
      setCurrentLine(message)
      setShowBubble(true)
      const timer = setTimeout(() => {
        setShowBubble(false)
        onMessageComplete?.()
      }, 2500)
      return () => clearTimeout(timer)
    } else {
      const lines = DONUT_LINES[mood] || DONUT_LINES.neutral
      const line = lines[Math.floor(Math.random() * lines.length)]
      setCurrentLine(line)
      setShowBubble(true)
      const timer = setTimeout(() => {
        setShowBubble(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [mood, message, onMessageComplete])

  const getDonutEmoji = () => {
    switch (mood) {
      case 'happy': return '😸'
      case 'angry': return '😾'
      case 'excited': return '🙀'
      case 'laser': return '😼'
      case 'puddle': return '💦'
      default: return '🐱'
    }
  }

  const getCrown = () => mood === 'happy' || mood === 'excited' ? '👑' : ''

  const expToNext = stats ? getExpToNextLevel(stats.level, stats.exp) : 0
  const expBarWidth = stats ? Math.max(0, Math.min(100, 100 - (expToNext / 50) * 100)) : 0

  return (
    <div className="relative flex flex-col items-center">
      {/* Speech bubble */}
      {showBubble && (
        <div className="absolute -top-20 z-20 animate-bounce-in">
          <div className="relative rounded-2xl bg-white px-4 py-3 shadow-lg border-2 border-kids-brown/20">
            <p className="text-sm font-bold text-kids-brown text-center whitespace-nowrap">
              {currentLine}
            </p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r-2 border-b-2 border-kids-brown/20" />
          </div>
        </div>
      )}

      {/* Donut character */}
      <div className={`relative transition-all duration-300 ${
        mood === 'puddle' ? 'animate-puddle-jump' : ''
      } ${
        mood === 'angry' || mood === 'laser' ? 'animate-shake' : ''
      }`}>
        {/* Crown */}
        {getCrown() && (
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl z-10">{getCrown()}</span>
        )}

        {/* Eye lasers */}
        {(mood === 'laser' || mood === 'angry') && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-full flex justify-center gap-2 z-20">
            <div className="w-8 h-1 bg-red-500 rounded-full animate-laser-left origin-right" />
            <div className="w-8 h-1 bg-red-500 rounded-full animate-laser-right origin-left" />
          </div>
        )}

        {/* Sparkles for happy/excited */}
        {(mood === 'happy' || mood === 'excited') && (
          <div className="absolute -top-2 -right-2 text-lg animate-pulse">✨</div>
        )}

        {/* Main cat face */}
        <span className="text-6xl md:text-7xl filter drop-shadow-lg">{getDonutEmoji()}</span>

        {/* Puddle effect */}
        {mood === 'puddle' && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-2xl animate-pulse">💧</div>
        )}
      </div>

      {/* Name tag */}
      <div className="mt-1 rounded-full bg-white/80 px-3 py-1 shadow-sm">
        <span className="text-xs font-bold text-kids-brown">Princess Donut</span>
      </div>

      {/* EXP bar */}
      {stats && (
        <div className="mt-2 w-full max-w-[180px]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-kids-brown">Lv.{stats.level}</span>
            <span className="text-xs text-kids-brown/60">{stats.exp} EXP</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/50 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-kids-yellow to-kids-orange transition-all duration-500"
              style={{ width: `${expBarWidth}%` }}
            />
          </div>
          {expToNext > 0 && (
            <p className="text-[10px] text-kids-brown/50 text-center mt-0.5">
              {expToNext} to next level
            </p>
          )}
        </div>
      )}

      {/* Loot preview - last 3 items */}
      {stats && stats.loot.length > 0 && (
        <div className="mt-1 flex gap-1">
          {stats.loot.slice(-3).map((item) => (
            <span
              key={item.id}
              className="text-sm"
              title={`${item.name} (${item.tier})`}
            >
              {LOOT_TIER_EMOJIS[item.tier]}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
