export interface VocabItem {
  id: string
  word: string // The written word in the target language (characters + romanization where helpful)
  emoji: string
  category: 'animals' | 'food' | 'funny'
  audioLang?: string // BCP-47 code passed to the Web Speech API, e.g. 'zh-CN'
}

export interface Language {
  code: string
  name: string
  flag: string
  vocab: VocabItem[]
}

// 'findword' is the Where's-Waldo-style mode: audio says a word, kid finds it in a busy scene.
export type GameScreen = 'language' | 'home' | 'flashcards' | 'differences' | 'findword'

export interface DifferenceSpot {
  id: number
  x: number // 0-1, percentage from left
  y: number // 0-1, percentage from top
  found: boolean
}
