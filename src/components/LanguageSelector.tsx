import { Language } from '@/types'

interface Props {
  languages: Language[]
  onSelect: (lang: Language) => void
}

export default function LanguageSelector({ languages, onSelect }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      <h1 className="mb-2 text-4xl font-bold text-kids-brown md:text-6xl">
        KidsLingo
      </h1>
      <p className="mb-8 text-xl text-kids-brown/70 md:text-2xl">
        Pick a language!
      </p>

      <div className="grid w-full max-w-md grid-cols-2 gap-4">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang)}
            className="flex flex-col items-center gap-3 rounded-3xl border-4 border-white bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
          >
            <span className="text-6xl md:text-7xl">{lang.flag}</span>
            <span className="text-lg font-bold text-kids-brown md:text-xl">
              {lang.name}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-8 text-sm text-kids-brown/50">
        No login needed - just pick and play!
      </p>
    </div>
  )
}
