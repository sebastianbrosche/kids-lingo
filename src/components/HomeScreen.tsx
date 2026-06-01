import { GameScreen, Language } from '@/types'

interface Props {
  language: Language
  onSelectGame: (game: GameScreen) => void
  onBack: () => void
}

export default function HomeScreen({ language, onSelectGame, onBack }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      <div className="mb-2 flex items-center gap-3">
        <span className="text-4xl md:text-5xl">{language.flag}</span>
        <h1 className="text-3xl font-bold text-kids-brown md:text-5xl">
          {language.name}
        </h1>
      </div>
      <p className="mb-8 text-lg text-kids-brown/70 md:text-xl">
        What do you want to play?
      </p>

      <div className="grid w-full max-w-md gap-4">
        <button
          onClick={() => onSelectGame('flashcards')}
          className="flex items-center gap-4 rounded-3xl border-4 border-kids-yellow bg-kids-yellow p-6 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
        >
          <span className="text-5xl md:text-6xl">🎯</span>
          <div className="text-left">
            <div className="text-xl font-bold text-kids-brown md:text-2xl">
              Flash Cards
            </div>
            <div className="text-sm text-kids-brown/70 md:text-base">
              Listen and tap the right card
            </div>
          </div>
        </button>

        <button
          onClick={() => onSelectGame('findword')}
          className="flex items-center gap-4 rounded-3xl border-4 border-kids-purple bg-kids-purple p-6 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
        >
          <span className="text-5xl md:text-6xl">🔎</span>
          <div className="text-left">
            <div className="text-xl font-bold text-kids-brown md:text-2xl">
              Find the Word
            </div>
            <div className="text-sm text-kids-brown/70 md:text-base">
              Hear a word, find it in the picture
            </div>
          </div>
        </button>

        <button
          onClick={() => onSelectGame('differences')}
          className="flex items-center gap-4 rounded-3xl border-4 border-kids-blue bg-kids-blue p-6 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
        >
          <span className="text-5xl md:text-6xl">🔍</span>
          <div className="text-left">
            <div className="text-xl font-bold text-kids-brown md:text-2xl">
              Find Differences
            </div>
            <div className="text-sm text-kids-brown/70 md:text-base">
              Spot what changed between two pictures
            </div>
          </div>
        </button>
      </div>

      <button
        onClick={onBack}
        className="mt-8 rounded-full bg-white px-6 py-3 font-bold text-kids-brown shadow-md transition-all hover:scale-105 active:scale-95"
      >
        🔙 Back to Languages
      </button>
    </div>
  )
}
