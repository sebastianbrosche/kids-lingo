import { useState, useCallback, useEffect } from 'react'
import { Language, DungeonLevel, DonutMood, PlayerStats, LootItem, EXP_REWARD } from '@/types'
import { getLevelVocab, rollLoot } from '@/data/levels'
import DonutGuide from '@/components/DonutGuide'
import FlashCardGame from '@/components/FlashCardGame'
import FindTheWord from '@/components/FindTheWord'
import MatchGame from '@/components/MatchGame'
import confetti from 'canvas-confetti'

interface Props {
  language: Language
  level: DungeonLevel
  stats: PlayerStats
  onUpdateStats: (stats: PlayerStats) => void
  onComplete: () => void
  onBack: () => void
}

export default function GameScreen({ language, level, stats, onUpdateStats, onComplete, onBack }: Props) {
  const [donutMood, setDonutMood] = useState<DonutMood>('excited')
  const [donutMessage, setDonutMessage] = useState('')
  const [phase, setPhase] = useState<'playing' | 'monster' | 'clear' | 'loot'>('playing')
  const [correctCount, setCorrectCount] = useState(0)
  const [monsterHealth, setMonsterHealth] = useState(100)
  const [showMissile, setShowMissile] = useState(false)
  const [monsterFading, setMonsterFading] = useState(false)
  const [earnedLoot, setEarnedLoot] = useState<LootItem | null>(null)
  const [localExp, setLocalExp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  const vocab = getLevelVocab(level, language.vocab)
  const boss = level.boss

  const QUESTIONS_TO_CLEAR = 5

  const handleCorrect = useCallback(() => {
    const newStreak = streak + 1
    setStreak(newStreak)
    if (newStreak > bestStreak) setBestStreak(newStreak)
    
    const expGain = EXP_REWARD.correct + (newStreak >= 3 ? EXP_REWARD.streak : 0)
    setLocalExp(prev => prev + expGain)
    setCorrectCount(prev => prev + 1)
    setDonutMood('happy')
    setDonutMessage('')

    // Check if level is cleared
    if (correctCount + 1 >= QUESTIONS_TO_CLEAR) {
      setTimeout(() => {
        setPhase('monster')
      }, 800)
    }
  }, [correctCount, streak, bestStreak])

  const handleWrong = useCallback(() => {
    setStreak(0)
    const angryLines = ['I mean, really!', 'This is an outrage!!', 'Unacceptable!']
    const line = angryLines[Math.floor(Math.random() * angryLines.length)]
    setDonutMood('angry')
    setDonutMessage(line)
    
    setTimeout(() => {
      setDonutMood('laser')
      setDonutMessage('PEW! PEW!')
    }, 1500)

    setTimeout(() => {
      setDonutMood('neutral')
      setDonutMessage('')
    }, 3500)
  }, [])

  // Monster fight phase
  useEffect(() => {
    if (phase !== 'monster') return

    setDonutMood('laser')
    setDonutMessage(`Take that, ${boss.name}!`)
    
    // Magic missile sequence
    const t1 = setTimeout(() => setShowMissile(true), 500)
    const t2 = setTimeout(() => setMonsterHealth(50), 800)
    const t3 = setTimeout(() => setShowMissile(false), 1200)
    const t4 = setTimeout(() => setShowMissile(true), 1500)
    const t5 = setTimeout(() => setMonsterHealth(0), 1800)
    const t6 = setTimeout(() => setMonsterFading(true), 2000)
    const t7 = setTimeout(() => {
      setShowMissile(false)
      setPhase('clear')
      
      // Grant EXP for level completion
      const totalExp = localExp + EXP_REWARD.levelComplete
      const newTotalExp = stats.totalExp + totalExp
      let newLevel = stats.level
      while (newExpForLevel(newLevel + 1) <= newTotalExp) {
        newLevel++
      }
      
      // Generate loot
      const lootName = rollLoot(level.id)
      const loot: LootItem = {
        id: `loot-${Date.now()}`,
        tier: getTierForLevel(level.id),
        name: lootName,
        emoji: getTierEmoji(getTierForLevel(level.id)),
        acquiredAt: Date.now(),
      }
      setEarnedLoot(loot)
      
      const updatedStats: PlayerStats = {
        ...stats,
        exp: newTotalExp,
        totalExp: newTotalExp,
        level: newLevel,
        completedLevels: [...new Set([...stats.completedLevels, level.id])],
        loot: [...stats.loot, loot],
        streak: bestStreak > stats.bestStreak ? bestStreak : stats.bestStreak,
        bestStreak: bestStreak > stats.bestStreak ? bestStreak : stats.bestStreak,
      }
      onUpdateStats(updatedStats)
      
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFD93D', '#FF8C42', '#69F0AE', '#4FC3F7', '#FF6B9D', '#9D4EDD'],
      })
    }, 2500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      clearTimeout(t6)
      clearTimeout(t7)
    }
  }, [phase])

  const newExpForLevel = (lvl: number) => {
    const thresholds = [0, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1400, 1600, 1800, 2000, 2500]
    return thresholds[Math.min(lvl, thresholds.length - 1)] || 0
  }

  const getTierForLevel = (lvl: number) => {
    if (lvl >= 18) return 'Celestial'
    if (lvl >= 15) return 'Legendary'
    if (lvl >= 12) return 'Platinum'
    if (lvl >= 8) return 'Gold'
    if (lvl >= 4) return 'Silver'
    return 'Bronze'
  }

  const getTierEmoji = (tier: string) => {
    const emojis: Record<string, string> = {
      Bronze: '🥉', Silver: '🥈', Gold: '🥇', Platinum: '💎', Legendary: '👑', Celestial: '🌟'
    }
    return emojis[tier] || '📦'
  }

  const handleContinue = () => {
    if (earnedLoot) {
      setPhase('loot')
    } else {
      onComplete()
    }
  }

  const handleLootDone = () => {
    onComplete()
  }

  const renderGame = () => {
    const gameProps = {
      language: { ...language, vocab },
      onBack,
      onCorrect: handleCorrect,
      onWrong: handleWrong,
      continuous: true,
      showStats: true,
      correctCount,
      targetCount: QUESTIONS_TO_CLEAR,
    }

    switch (level.gameType) {
      case 'flashcards':
        return <FlashCardGame {...gameProps} />
      case 'findword':
        return <FindTheWord {...gameProps} />
      case 'match':
        return <MatchGame {...gameProps} />
      default:
        return <FlashCardGame {...gameProps} />
    }
  }

  // Monster encounter phase
  if (phase === 'monster') {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-stone-900 to-stone-950 p-6 relative overflow-hidden">
        {/* Background monsters */}
        <div className="absolute inset-0 opacity-20">
          {level.monsters.map((m, i) => (
            <span key={i} className="absolute text-6xl animate-pulse" style={{
              left: `${20 + (i * 15)}%`,
              top: `${30 + (i % 2) * 20}%`,
              animationDelay: `${i * 0.3}s`
            }}>{m}</span>
          ))}
        </div>

        <DonutGuide mood={donutMood} message={donutMessage} stats={stats} />

        {/* Monster */}
        <div className={`relative mt-8 transition-all duration-1000 ${monsterFading ? 'animate-monster-fade' : ''}`}>
          <div className="flex flex-col items-center">
            {/* Boss */}
            <div className="relative">
              <span className="text-8xl filter drop-shadow-[0_0_20px_rgba(255,0,0,0.5)]">{boss.emoji}</span>
              {boss.helmet && <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl">{boss.helmet}</span>}
              {boss.weapon && <span className="absolute -right-4 top-1/2 text-3xl animate-wiggle">{boss.weapon}</span>}
            </div>
            
            {/* Health bar */}
            <div className="mt-4 w-48 h-4 rounded-full bg-red-900/50 border-2 border-red-500 overflow-hidden">
              <div 
                className="h-full bg-red-500 transition-all duration-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                style={{ width: `${monsterHealth}%` }}
              />
            </div>
            <p className="mt-2 text-red-400 font-bold text-sm">{boss.name}</p>
          </div>

          {/* Magic missile */}
          {showMissile && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-magic-missile">
              <span className="text-6xl">✨</span>
              <div className="absolute inset-0 animate-missile-trail">
                <span className="text-4xl opacity-50">⚡</span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Level clear phase
  if (phase === 'clear') {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-emerald-600 to-emerald-800 p-6">
        <DonutGuide mood="excited" message={`Level ${level.id} cleared!`} stats={stats} />
        
        <div className="mt-6 flex gap-2">
          {[1, 2, 3].map((star) => (
            <span
              key={star}
              className="text-5xl animate-pop text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]"
              style={{ animationDelay: `${star * 200}ms` }}
            >
              ⭐
            </span>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-center">
          <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">+{localExp + EXP_REWARD.levelComplete}</div>
            <div className="text-xs text-white/70">EXP earned</div>
          </div>
          <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">{bestStreak}</div>
            <div className="text-xs text-white/70">Best streak</div>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="mt-8 rounded-full bg-yellow-400 px-8 py-4 text-xl font-bold text-kids-brown shadow-lg transition-all hover:scale-105 active:scale-95 animate-bounce"
        >
          🏆 Continue Journey
        </button>
      </div>
    )
  }

  // Loot phase
  if (phase === 'loot' && earnedLoot) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-purple-600 to-purple-900 p-6">
        <DonutGuide mood="excited" message={`You found a ${earnedLoot.tier} treasure!`} stats={stats} />
        
        <div className="mt-8 animate-pop">
          <div className="relative flex flex-col items-center">
            <span className="text-8xl">{earnedLoot.emoji}</span>
            <div className="mt-4 rounded-2xl bg-white/20 px-6 py-3 backdrop-blur-sm">
              <p className="text-lg font-bold text-white">{earnedLoot.name}</p>
              <p className="text-sm text-yellow-300">{earnedLoot.tier} Tier</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLootDone}
          className="mt-8 rounded-full bg-yellow-400 px-8 py-4 text-xl font-bold text-kids-brown shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          🎒 Add to Inventory
        </button>
      </div>
    )
  }

  // Playing phase
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-stone-800 to-stone-950">
      {/* Donut Guide + Level info */}
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/30 active:scale-95"
          >
            🔙
          </button>
          <div className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
            <span className="text-xs font-bold text-white">Lv.{level.id} — {level.name}</span>
          </div>
        </div>
        <div className="rounded-full bg-yellow-400/80 px-3 py-1">
          <span className="text-xs font-bold text-kids-brown">{correctCount}/{QUESTIONS_TO_CLEAR} 🎯</span>
        </div>
      </div>

      <div className="flex justify-center py-1">
        <DonutGuide mood={donutMood} message={donutMessage} stats={stats} />
      </div>

      {/* Game Area */}
      <div className="flex-1 overflow-hidden rounded-t-3xl bg-white shadow-2xl">
        {renderGame()}
      </div>
    </div>
  )
}
