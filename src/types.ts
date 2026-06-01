export interface VocabItem {
  id: string
  word: string
  emoji: string
  category: 'animals' | 'food' | 'funny'
  audioLang?: string
}

export interface Language {
  code: string
  name: string
  flag: string
  vocab: VocabItem[]
}

export interface Monster {
  name: string
  emoji: string
  description: string
  weapon?: string
  helmet?: string
}

export interface DungeonLevel {
  id: number
  name: string
  theme: string
  boss: Monster
  monsters: string[]
  vocabIndices: number[]
  gameType: 'flashcards' | 'findword' | 'match'
  color: string
  requiredExp: number
}

export type GameScreen = 'language' | 'journey' | 'level' | 'flashcards' | 'findword' | 'match' | 'home' | 'differences'

export interface DifferenceSpot {
  id: number
  x: number
  y: number
  found: boolean
}

export type DonutMood = 'neutral' | 'happy' | 'angry' | 'excited' | 'laser' | 'puddle'

export interface PlayerStats {
  exp: number
  level: number
  totalExp: number
  completedLevels: number[]
  loot: LootItem[]
  streak: number
  bestStreak: number
}

export interface LootItem {
  id: string
  tier: LootTier
  name: string
  emoji: string
  acquiredAt: number
}

export type LootTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Legendary' | 'Celestial'

export interface ExpReward {
  correct: number
  streak: number
  levelComplete: number
}

export const EXP_LEVELS = [0, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1400, 1600, 1800, 2000, 2500]

export const EXP_REWARD: ExpReward = {
  correct: 10,
  streak: 5,
  levelComplete: 50,
}

export const LOOT_TIERS: LootTier[] = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Legendary', 'Celestial']

export const LOOT_TIER_COLORS: Record<LootTier, string> = {
  Bronze: '#CD7F32',
  Silver: '#C0C0C0',
  Gold: '#FFD700',
  Platinum: '#E5E4E2',
  Legendary: '#FF6B9D',
  Celestial: '#9D4EDD',
}

export const LOOT_TIER_EMOJIS: Record<LootTier, string> = {
  Bronze: '🥉',
  Silver: '🥈',
  Gold: '🥇',
  Platinum: '💎',
  Legendary: '👑',
  Celestial: '🌟',
}

export const LOOT_NAMES: Record<LootTier, string[]> = {
  Bronze: ['Rusty Sword', 'Wooden Shield', 'Leather Boots', 'Cloth Cape', 'Copper Ring'],
  Silver: ['Steel Dagger', 'Iron Helm', 'Chain Mail', 'Quick Boots', 'Moonstone'],
  Gold: ['Golden Sword', 'Dragon Scale', 'Phoenix Feather', 'Magic Boots', 'Crystal Orb'],
  Platinum: ['Diamond Blade', 'Titan Plate', 'Void Cloak', 'Swift Boots', 'Star Gem'],
  Legendary: ['Excalibur', 'Aegis Shield', 'Crown of Kings', 'Boots of Hermes', 'Eye of Truth'],
  Celestial: ['Cosmic Blade', 'Nebula Armor', 'Stardust Cloak', 'Lightning Boots', 'Infinity Stone'],
}
