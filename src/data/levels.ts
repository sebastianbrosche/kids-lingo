import { DungeonLevel, Monster, VocabItem } from '@/types'

// 18 Dungeon Crawler Carl inspired levels — DCC themed monsters

const dccMonsters: Record<number, Monster> = {
  1: {
    name: 'Goblin Scullion',
    emoji: '👺',
    description: 'A wretched goblin with a pineapple on a stick and a saucepan on its head',
    weapon: '🍍',
    helmet: '🍳',
  },
  2: {
    name: 'Ratling Swarm',
    emoji: '🐀',
    description: 'Dozens of bite-sized rats wearing tiny skull caps',
    weapon: '🦴',
    helmet: '🪖',
  },
  3: {
    name: 'Fungal Brute',
    emoji: '🍄',
    description: 'A towering mushroom creature with spore dust for breath',
    weapon: '☠️',
    helmet: '🍄',
  },
  4: {
    name: 'Skeleton Archer',
    emoji: '💀',
    description: 'Bony fingers draw a bow of femur and sinew',
    weapon: '🏹',
    helmet: '🎩',
  },
  5: {
    name: 'Slime Mold',
    emoji: '🦠',
    description: 'A quivering cube of acidic jelly that absorbs everything',
    weapon: '💧',
    helmet: '🔮',
  },
  6: {
    name: 'Orc Berserker',
    emoji: '👹',
    description: 'A hulking green brute with a club made from a table leg',
    weapon: '🏏',
    helmet: '⛑️',
  },
  7: {
    name: 'Spider Queen',
    emoji: '🕷️',
    description: 'A massive arachnid dripping venom from her fangs',
    weapon: '🕸️',
    helmet: '👑',
  },
  8: {
    name: 'Ghoul Pack',
    emoji: '🧟',
    description: 'Hungering dead who claw from the grave hungry for brains',
    weapon: '⚰️',
    helmet: '🪦',
  },
  9: {
    name: 'Minotaur Guard',
    emoji: '🐂',
    description: 'A horned beast-man guarding the labyrinth entrance',
    weapon: '🔱',
    helmet: '🛡️',
  },
  10: {
    name: 'Lich Sorcerer',
    emoji: '💀',
    description: 'An undead wizard bound to a phylactery of pure malice',
    weapon: '🔮',
    helmet: '👑',
  },
  11: {
    name: 'Mimic Chest',
    emoji: '📦',
    description: 'A treasure chest that grew teeth and a terrible appetite',
    weapon: '🔑',
    helmet: '💰',
  },
  12: {
    name: 'Harpy Screecher',
    emoji: '🦅',
    description: 'A winged hag whose scream shatters eardrums and hope',
    weapon: '⚡',
    helmet: '🪶',
  },
  13: {
    name: 'Troll Crusher',
    emoji: '🧌',
    description: 'A regenerating mountain of moss and bad temper',
    weapon: '🪨',
    helmet: '🌿',
  },
  14: {
    name: 'Mummy Pharaoh',
    emoji: '👑',
    description: 'Ancient royalty wrapped in cursed linen and gold',
    weapon: '⚱️',
    helmet: '👑',
  },
  15: {
    name: 'Dark Elf Assassin',
    emoji: '🗡️',
    description: 'A shadow-clad killer with poisoned blades and sharp ears',
    weapon: '🗡️',
    helmet: '🎭',
  },
  16: {
    name: 'Beholder',
    emoji: '👁️',
    description: 'A floating orb of flesh with ten eye stalks of doom',
    weapon: '👁️',
    helmet: '🔮',
  },
  17: {
    name: 'Lich King',
    emoji: '👑',
    description: 'The supreme undead ruler with a crown of frozen souls',
    weapon: '⚔️',
    helmet: '👑',
  },
  18: {
    name: 'Dragon Tyrant',
    emoji: '🐉',
    description: 'An ancient red dragon whose breath melts castles',
    weapon: '🔥',
    helmet: '💎',
  },
}

export const dungeonLevels: DungeonLevel[] = [
  {
    id: 1,
    name: 'The Scullion Kitchen',
    theme: 'A filthy kitchen where goblins cook terrible meals in dented pots',
    boss: dccMonsters[1],
    monsters: ['🍳', '🍍', '🍲', '👺', '🥄'],
    vocabIndices: [0, 1, 2, 3, 4],
    gameType: 'flashcards',
    color: '#8B6914',
    requiredExp: 0,
  },
  {
    id: 2,
    name: 'The Rat Warren',
    theme: 'Tunnels of gnawed bone and chewed leather where ratlings breed',
    boss: dccMonsters[2],
    monsters: ['🐀', '🦴', '🧀', '🪖', '🕸️'],
    vocabIndices: [5, 6, 7, 8, 9],
    gameType: 'findword',
    color: '#4A4A4A',
    requiredExp: 50,
  },
  {
    id: 3,
    name: 'The Fungal Depths',
    theme: 'Caverns glowing with phosphorescent mushrooms and spore clouds',
    boss: dccMonsters[3],
    monsters: ['🍄', '☠️', '🌿', '🦠', '💨'],
    vocabIndices: [10, 11, 12, 13, 14],
    gameType: 'match',
    color: '#6B8E23',
    requiredExp: 100,
  },
  {
    id: 4,
    name: 'The Bone Gallery',
    theme: 'A hallway lined with skeletons posed in eternal combat stances',
    boss: dccMonsters[4],
    monsters: ['💀', '🏹', '🦴', '🎩', '⚰️'],
    vocabIndices: [15, 16, 17, 18, 19],
    gameType: 'flashcards',
    color: '#F5F5DC',
    requiredExp: 150,
  },
  {
    id: 5,
    name: 'The Ooze Pit',
    theme: 'A room where the floor is alive and hungry for adventurers',
    boss: dccMonsters[5],
    monsters: ['🦠', '💧', '🔮', '🧪', '🌊'],
    vocabIndices: [0, 2, 4, 6, 8],
    gameType: 'findword',
    color: '#32CD32',
    requiredExp: 200,
  },
  {
    id: 6,
    name: 'The Orc Barracks',
    theme: 'Bunk beds made of stolen furniture, orc snores echoing off stone',
    boss: dccMonsters[6],
    monsters: ['👹', '🏏', '⛑️', '🍖', '🛡️'],
    vocabIndices: [1, 3, 5, 7, 9],
    gameType: 'match',
    color: '#228B22',
    requiredExp: 300,
  },
  {
    id: 7,
    name: 'The Spider Nest',
    theme: 'Thick webs cover every surface, cocoons hang from the ceiling',
    boss: dccMonsters[7],
    monsters: ['🕷️', '🕸️', '🕷️', '👑', '🥚'],
    vocabIndices: [10, 12, 14, 16, 18],
    gameType: 'flashcards',
    color: '#4B0082',
    requiredExp: 400,
  },
  {
    id: 8,
    name: 'The Graveyard Shift',
    theme: 'Headstones tilt at crazy angles as the dead claw their way up',
    boss: dccMonsters[8],
    monsters: ['🧟', '⚰️', '🪦', '🧟', '🧠'],
    vocabIndices: [11, 13, 15, 17, 19],
    gameType: 'findword',
    color: '#2F4F4F',
    requiredExp: 500,
  },
  {
    id: 9,
    name: 'The Labyrinth Gate',
    theme: 'A massive bronze gate guarded by a beast with horns of iron',
    boss: dccMonsters[9],
    monsters: ['🐂', '🔱', '🛡️', '📜', '🔒'],
    vocabIndices: [0, 3, 6, 9, 12],
    gameType: 'match',
    color: '#8B4513',
    requiredExp: 600,
  },
  {
    id: 10,
    name: 'The Phylactery Vault',
    theme: 'A crystal chamber where a lich stores his soul in jeweled jars',
    boss: dccMonsters[10],
    monsters: ['💀', '🔮', '👑', '⚗️', '💎'],
    vocabIndices: [1, 4, 7, 10, 13],
    gameType: 'flashcards',
    color: '#191970',
    requiredExp: 700,
  },
  {
    id: 11,
    name: 'The Treasure Room',
    theme: 'Gold coins and jewels glint in the dark — but some chests bite',
    boss: dccMonsters[11],
    monsters: ['📦', '💰', '🔑', '💎', '👅'],
    vocabIndices: [2, 5, 8, 11, 14],
    gameType: 'findword',
    color: '#FFD700',
    requiredExp: 800,
  },
  {
    id: 12,
    name: 'The Aerie Cliffs',
    theme: 'Wind howls through mountain peaks where harpies guard their nests',
    boss: dccMonsters[12],
    monsters: ['🦅', '⚡', '🪶', '💨', '🥚'],
    vocabIndices: [3, 6, 9, 12, 15],
    gameType: 'match',
    color: '#87CEEB',
    requiredExp: 900,
  },
  {
    id: 13,
    name: 'The Troll Bridge',
    theme: 'A mossy stone bridge where trolls demand riddles or tolls',
    boss: dccMonsters[13],
    monsters: ['🧌', '🪨', '🌿', '💧', '👣'],
    vocabIndices: [4, 7, 10, 13, 16],
    gameType: 'flashcards',
    color: '#556B2F',
    requiredExp: 1000,
  },
  {
    id: 14,
    name: 'The Tomb of Kings',
    theme: 'Sarcophagi of ancient pharaohs line the walls, their curses active',
    boss: dccMonsters[14],
    monsters: ['👑', '⚱️', '📜', '🔺', '💀'],
    vocabIndices: [5, 8, 11, 14, 17],
    gameType: 'findword',
    color: '#DAA520',
    requiredExp: 1200,
  },
  {
    id: 15,
    name: 'The Shadow Bazaar',
    theme: 'A dark market where dark elves trade poison and secrets',
    boss: dccMonsters[15],
    monsters: ['🗡️', '🎭', '☠️', '💀', '🔮'],
    vocabIndices: [6, 9, 12, 15, 18],
    gameType: 'match',
    color: '#1a1a2e',
    requiredExp: 1400,
  },
  {
    id: 16,
    name: 'The Eye Chamber',
    theme: 'A dome of flesh where a beholder floats, its eyes scanning everything',
    boss: dccMonsters[16],
    monsters: ['👁️', '🔮', '👁️', '👁️', '👁️'],
    vocabIndices: [7, 10, 13, 16, 19],
    gameType: 'flashcards',
    color: '#800080',
    requiredExp: 1600,
  },
  {
    id: 17,
    name: 'The Frozen Throne',
    theme: 'An ice palace where the Lich King sits upon a throne of frozen souls',
    boss: dccMonsters[17],
    monsters: ['👑', '⚔️', '❄️', '💀', '🔮'],
    vocabIndices: [0, 4, 8, 12, 16],
    gameType: 'findword',
    color: '#00BFFF',
    requiredExp: 1800,
  },
  {
    id: 18,
    name: 'The Dragon Spire',
    theme: 'The peak of a volcanic mountain where an ancient dragon sleeps on gold',
    boss: dccMonsters[18],
    monsters: ['🐉', '🔥', '💎', '🏔️', '⚡'],
    vocabIndices: [1, 5, 9, 13, 17],
    gameType: 'match',
    color: '#8B0000',
    requiredExp: 2000,
  },
]

export const getLevelVocab = (level: DungeonLevel, vocab: VocabItem[]) => {
  return level.vocabIndices.map(i => vocab[i]).filter(Boolean)
}

export const getExpForLevel = (playerLevel: number): number => {
  const thresholds = [0, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1400, 1600, 1800, 2000, 2500]
  return thresholds[Math.min(playerLevel, thresholds.length - 1)] || 0
}

export const getExpToNextLevel = (playerLevel: number, currentExp: number): number => {
  const next = getExpForLevel(playerLevel + 1)
  return Math.max(0, next - currentExp)
}

export const rollLoot = (levelId: number): string => {
  // Higher level = better chance at higher tier loot
  const roll = Math.random()
  let tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Legendary' | 'Celestial' = 'Bronze'
  if (levelId >= 18 && roll > 0.7) tier = 'Celestial'
  else if (levelId >= 15 && roll > 0.6) tier = 'Legendary'
  else if (levelId >= 12 && roll > 0.5) tier = 'Platinum'
  else if (levelId >= 8 && roll > 0.4) tier = 'Gold'
  else if (levelId >= 4 && roll > 0.3) tier = 'Silver'

  const names: Record<string, string[]> = {
    Bronze: ['Rusty Sword', 'Wooden Shield', 'Leather Boots', 'Cloth Cape', 'Copper Ring'],
    Silver: ['Steel Dagger', 'Iron Helm', 'Chain Mail', 'Quick Boots', 'Moonstone'],
    Gold: ['Golden Sword', 'Dragon Scale', 'Phoenix Feather', 'Magic Boots', 'Crystal Orb'],
    Platinum: ['Diamond Blade', 'Titan Plate', 'Void Cloak', 'Swift Boots', 'Star Gem'],
    Legendary: ['Excalibur', 'Aegis Shield', 'Crown of Kings', 'Boots of Hermes', 'Eye of Truth'],
    Celestial: ['Cosmic Blade', 'Nebula Armor', 'Stardust Cloak', 'Lightning Boots', 'Infinity Stone'],
  }
  const tierNames = names[tier]
  return tierNames[Math.floor(Math.random() * tierNames.length)]
}