import { useRef, useState } from 'react'
import { Language, DungeonLevel, PlayerStats } from '@/types'
import { dungeonLevels } from '@/data/levels'
import DonutGuide from '@/components/DonutGuide'

interface Props {
  language: Language
  stats: PlayerStats
  onSelectLevel: (level: DungeonLevel) => void
  onBack: () => void
}

export default function JourneyMap({ language, stats, onSelectLevel, onBack }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [donutMood] = useState<'neutral' | 'excited'>('excited')

  const handleLevelClick = (level: DungeonLevel) => {
    if (isUnlocked(level.id)) {
      onSelectLevel(level)
    }
  }

  const isUnlocked = (levelId: number) => {
    return levelId === 1 || stats.completedLevels.includes(levelId - 1)
  }

  const isCompleted = (levelId: number) => {
    return stats.completedLevels.includes(levelId)
  }

  const getStars = (levelId: number) => {
    if (!isCompleted(levelId)) return 0
    // Stars based on level ID as a simple heuristic
    return 3
  }

  const getTierColor = (levelId: number) => {
    if (levelId <= 3) return 'from-stone-400 to-stone-600'
    if (levelId <= 6) return 'from-emerald-400 to-emerald-700'
    if (levelId <= 9) return 'from-blue-400 to-blue-700'
    if (levelId <= 12) return 'from-purple-400 to-purple-700'
    if (levelId <= 15) return 'from-orange-400 to-orange-700'
    return 'from-red-500 to-red-800'
  }

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-b from-stone-800 to-stone-950 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={onBack}
          className="rounded-full bg-white/20 p-3 text-xl font-bold text-white backdrop-blur-sm transition-all hover:bg-white/30 active:scale-95"
        >
          🔙
        </button>
        <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm"
        >
          <span className="text-2xl">{language.flag}</span>
          <span className="font-bold text-white">{language.name}</span>
        </div>
        <div className="rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm flex items-center gap-2">
          <span className="font-bold text-yellow-400">Lv.{stats.level}</span>
          <span className="font-bold text-white">{stats.exp} EXP</span>
        </div>
      </div>
      
      {/* Donut Guide */}
      <div className="flex justify-center py-2">
        <DonutGuide 
          mood={donutMood} 
          message={`${language.name} Dungeon — ${stats.completedLevels.length} of 18 cleared!`} 
          stats={stats}
        />
      </div>

      {/* Journey path - horizontal scroll */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex h-full items-center px-8 gap-6 min-w-max py-4"
        >
          {dungeonLevels.map((level, index) => {
            const unlocked = isUnlocked(level.id)
            const completed = isCompleted(level.id)
            const stars = getStars(level.id)
            const boss = level.boss

            return (
              <div key={level.id} className="relative flex flex-col items-center">
                {/* Path connector */}
                {index > 0 && (
                  <div className={`absolute -left-6 top-1/2 h-3 w-6 -translate-y-1/2 rounded-full ${
                    unlocked ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]' : 'bg-white/10'
                  }`} />
                )}

                {/* Level node */}
                <button
                  onClick={() => handleLevelClick(level)}
                  disabled={!unlocked}
                  className={`relative flex flex-col items-center gap-2 transition-all ${
                    unlocked
                      ? 'hover:scale-110 active:scale-95 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  {/* Boss circle */}
                  <div
                    className={`relative flex h-24 w-24 items-center justify-center rounded-full border-4 shadow-xl transition-all ${
                      completed
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.5)]'
                        : unlocked
                        ? `bg-gradient-to-br ${getTierColor(level.id)} border-white/80`
                        : 'bg-white/10 border-white/20'
                    }`}
                  >
                    {/* Boss emoji */}
                    <span className="text-4xl">{boss.emoji}</span>

                    {/* Weapon */}
                    {unlocked && boss.weapon && (
                      <span className="absolute -right-1 bottom-1 text-xl animate-wiggle">{boss.weapon}</span>
                    )}

                    {/* Helmet */}
                    {unlocked && boss.helmet && (
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-lg">{boss.helmet}</span>
                    )}
                  </div>

                  {/* Level number */}
                  <div className={`rounded-full px-3 py-1 shadow-sm ${
                    completed ? 'bg-yellow-400' : unlocked ? 'bg-white/90' : 'bg-white/30'
                  }`}>
                    <span className="text-xs font-bold text-kids-brown">
                      Lv.{level.id}
                    </span>
                  </div>

                  {/* Level name */}
                  <div className={`rounded-full px-3 py-1 shadow-sm max-w-[120px] ${
                    completed ? 'bg-yellow-400/80' : unlocked ? 'bg-white/80' : 'bg-white/20'
                  }`}>
                    <span className="text-[10px] font-bold text-kids-brown text-center block truncate">
                      {level.name}
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map((star) => (
                      <span
                        key={star}
                        className={`text-sm ${
                          star <= stars ? 'text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.8)]' : 'text-white/20'
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>

                  {/* Lock icon */}
                  {!unlocked && (
                    <div className="absolute top-0 right-0 text-2xl animate-pulse">🔒</div>
                  )}

                  {/* Completed check */}
                  {completed && (
                    <div className="absolute -top-2 -left-2 text-2xl animate-bounce">✅</div>
                  )}
                </button>
              </div>
            )
          })}

          {/* End trophy */}
          <div className="relative flex flex-col items-center gap-2">
            <div className={`flex h-24 w-24 items-center justify-center rounded-full border-4 shadow-xl ${
              stats.completedLevels.length === dungeonLevels.length
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300 shadow-[0_0_30px_rgba(234,179,8,0.6)]'
                : 'bg-white/10 border-white/20'
            }`}>
              <span className="text-4xl">🏆</span>
            </div>
            <div className={`rounded-full px-3 py-1 shadow-sm ${
              stats.completedLevels.length === dungeonLevels.length ? 'bg-yellow-400' : 'bg-white/20'
            }`}>
              <span className="text-xs font-bold text-kids-brown">Victory!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="p-4 text-center">
        <p className="text-sm text-white/70">
          Swipe to explore the dungeon! Clear each level to unlock the next.
        </p>
      </div>
    </div>
  )
}
