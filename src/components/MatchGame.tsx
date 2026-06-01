import { useState, useCallback } from 'react'
import { Language } from '@/types'
import { useSpeech } from '@/hooks/useSpeech'

interface Props {
  language: Language
  onBack: () => void
  onCorrect?: () => void
  onWrong?: () => void
  onComplete?: (score: number, total: number) => void
  continuous?: boolean
  correctCount?: number
  targetCount?: number
}

interface Card {
  id: string
  type: 'word' | 'emoji'
  content: string
  vocabId: string
  matched: boolean
  selected: boolean
}

function shuffle<T>(array: T[]): T[] {
  const a = [...array]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MatchGame({ language, onBack, onCorrect, onWrong, continuous }: Props) {
  const { speak } = useSpeech()
  const [cards, setCards] = useState<Card[]>(() => {
    const allCards: Card[] = []
    language.vocab.forEach(v => {
      allCards.push({ id: v.id + '-word', type: 'word', content: v.word, vocabId: v.id, matched: false, selected: false })
      allCards.push({ id: v.id + '-emoji', type: 'emoji', content: v.emoji, vocabId: v.id, matched: false, selected: false })
    })
    return shuffle(allCards)
  })
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [matchedCount, setMatchedCount] = useState(0)
  const [locked, setLocked] = useState(false)
  const [matchStreak, setMatchStreak] = useState(0)

  const totalPairs = language.vocab.length

  const handleCardClick = useCallback((card: Card) => {
    if (card.matched || locked || selectedCards.includes(card.id)) return

    const newSelected = [...selectedCards, card.id]
    setSelectedCards(newSelected)
    setCards(prev => prev.map(c => c.id === card.id ? { ...c, selected: true } : c))

    if (card.type === 'word') {
      const vocabItem = language.vocab.find(v => v.id === card.vocabId)
      if (vocabItem) speak(vocabItem.word, vocabItem.audioLang || 'en-US')
    }

    if (newSelected.length === 2) {
      setLocked(true)
      const card1 = cards.find(c => c.id === newSelected[0])!
      const card2 = cards.find(c => c.id === newSelected[1])!

      if (card1.vocabId === card2.vocabId) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.vocabId === card1.vocabId ? { ...c, matched: true, selected: false } : c
          ))
          setMatchedCount(prev => {
            const newCount = prev + 1
            return newCount
          })
          setMatchStreak(prev => prev + 1)
          setSelectedCards([])
          setLocked(false)
          onCorrect?.()
          
          // In continuous mode, when all pairs matched, reshuffle and continue
          if (continuous) {
            setTimeout(() => {
              const allCards: Card[] = []
              language.vocab.forEach(v => {
                allCards.push({ id: v.id + '-word-' + Date.now(), type: 'word', content: v.word, vocabId: v.id, matched: false, selected: false })
                allCards.push({ id: v.id + '-emoji-' + Date.now(), type: 'emoji', content: v.emoji, vocabId: v.id, matched: false, selected: false })
              })
              setCards(shuffle(allCards))
              setSelectedCards([])
              setLocked(false)
            }, 800)
          }
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            newSelected.includes(c.id) ? { ...c, selected: false } : c
          ))
          setSelectedCards([])
          setLocked(false)
          setMatchStreak(0)
          onWrong?.()
        }, 800)
      }
    }
  }, [cards, selectedCards, locked, speak, language.vocab, totalPairs, onCorrect, onWrong, continuous])

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onBack} className="rounded-full bg-white px-4 py-2 font-bold text-kids-brown shadow-md transition-all hover:scale-105 active:scale-95">
          🔙
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-2xl">🔥</span>
            <span className="text-xl font-bold text-kids-brown">{matchStreak}</span>
          </div>
          <div className="rounded-full bg-white px-4 py-2 font-bold text-kids-brown shadow-md">
            {matchedCount}
          </div>
        </div>
      </div>

      <p className="mb-4 text-center text-sm text-kids-brown/70">
        Tap a word, then its matching picture!
      </p>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card)}
            disabled={card.matched || locked}
            className={`flex items-center justify-center rounded-2xl border-4 p-4 shadow-lg transition-all text-lg font-bold ${
              card.matched
                ? 'bg-kids-green border-kids-green opacity-50'
                : card.selected
                ? 'bg-kids-yellow border-kids-yellow scale-105'
                : 'bg-white border-white hover:scale-105 active:scale-95'
            }`}
          >
            {card.type === 'emoji' ? (
              <span className="text-4xl">{card.content}</span>
            ) : (
              <span className="text-center text-sm">{card.content}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
