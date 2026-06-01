import { useState, useCallback } from 'react'
import { GameScreen, Language, PlayerStats, DungeonLevel } from '@/types'
import { languages } from '@/data/vocabulary'
import LanguageSelector from '@/components/LanguageSelector'
import JourneyMap from '@/components/JourneyMap'
import GameScreenComp from '@/components/GameScreen'
import VersionFooter from '@/components/VersionFooter'

const initialStats: PlayerStats = {
  exp: 0,
  level: 1,
  totalExp: 0,
  completedLevels: [],
  loot: [],
  streak: 0,
  bestStreak: 0,
}

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('language')
  const [selectedLang, setSelectedLang] = useState<Language | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<DungeonLevel | null>(null)
  const [stats, setStats] = useState<PlayerStats>(initialStats)

  const handleSelectLanguage = useCallback((lang: Language) => {
    setSelectedLang(lang)
    setScreen('journey')
  }, [])

  const handleSelectLevel = useCallback((level: DungeonLevel) => {
    setSelectedLevel(level)
    setScreen('level')
  }, [])

  const handleUpdateStats = useCallback((newStats: PlayerStats) => {
    setStats(newStats)
  }, [])

  const handleLevelComplete = useCallback(() => {
    setSelectedLevel(null)
    setScreen('journey')
  }, [])

  const handleBack = useCallback(() => {
    if (screen === 'level') {
      setSelectedLevel(null)
      setScreen('journey')
    } else if (screen === 'journey') {
      setSelectedLang(null)
      setScreen('language')
    } else {
      setScreen('language')
    }
  }, [screen])

  return (
    <div className="h-full w-full bg-kids-cream">
      {screen === 'language' && (
        <LanguageSelector languages={languages} onSelect={handleSelectLanguage} />
      )}
      {screen === 'journey' && selectedLang && (
        <JourneyMap
          language={selectedLang}
          stats={stats}
          onSelectLevel={handleSelectLevel}
          onBack={handleBack}
        />
      )}
      {screen === 'level' && selectedLang && selectedLevel && (
        <GameScreenComp
          language={selectedLang}
          level={selectedLevel}
          stats={stats}
          onUpdateStats={handleUpdateStats}
          onComplete={handleLevelComplete}
          onBack={handleBack}
        />
      )}
      <VersionFooter />
    </div>
  )
}
