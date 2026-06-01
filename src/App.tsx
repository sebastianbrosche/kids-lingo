import { useState, useCallback } from 'react'
import { GameScreen, Language } from '@/types'
import { languages } from '@/data/vocabulary'
import LanguageSelector from '@/components/LanguageSelector'
import HomeScreen from '@/components/HomeScreen'
import FlashCardGame from '@/components/FlashCardGame'
import FindTheWord from '@/components/FindTheWord'
import FindDifferences from '@/components/FindDifferences'
import VersionFooter from '@/components/VersionFooter'

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('language')
  const [selectedLang, setSelectedLang] = useState<Language | null>(null)

  const handleSelectLanguage = useCallback((lang: Language) => {
    setSelectedLang(lang)
    setScreen('home')
  }, [])

  const handleSelectGame = useCallback((game: GameScreen) => {
    setScreen(game)
  }, [])

  const handleBack = useCallback(() => {
    if (screen === 'home') {
      setSelectedLang(null)
      setScreen('language')
    } else {
      setScreen('home')
    }
  }, [screen])

  return (
    <div className="h-full w-full bg-kids-cream">
      {screen === 'language' && (
        <LanguageSelector languages={languages} onSelect={handleSelectLanguage} />
      )}
      {screen === 'home' && selectedLang && (
        <HomeScreen language={selectedLang} onSelectGame={handleSelectGame} onBack={handleBack} />
      )}
      {screen === 'flashcards' && selectedLang && (
        <FlashCardGame language={selectedLang} onBack={handleBack} />
      )}
      {screen === 'findword' && selectedLang && (
        <FindTheWord language={selectedLang} onBack={handleBack} />
      )}
      {screen === 'differences' && (
        <FindDifferences onBack={handleBack} />
      )}
      <VersionFooter />
    </div>
  )
}
