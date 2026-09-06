import tarotData from '@/data/tarot-data.json';

export type Suit = 'cups' | 'pentacles' | 'swords' | 'wands' | 'major';

export interface CardMetadata {
  id: number;
  name: string;
  suit: Suit;
  meaning: string;
  reversedMeaning: string;
  image: string;
  yesNo: 'Yes' | 'No' | 'Maybe';
}

function getSuitFromId(id: number): Suit {
  if (id >= 0 && id <= 21) return 'major';
  if (id >= 22 && id <= 35) return 'cups';
  if (id >= 36 && id <= 49) return 'pentacles';
  if (id >= 50 && id <= 63) return 'swords';
  if (id >= 64 && id <= 77) return 'wands';
  return 'major';
}

export function getCardById(cardId: number): CardMetadata | null {
  const cards = tarotData.cards as any[];
  const card = cards.find((c) => c.id === cardId);

  if (!card) return null;

  return {
    id: card.id,
    name: card.name,
    suit: getSuitFromId(card.id),
    meaning: card.upright,
    reversedMeaning: card.reversed,
    image: card.image,
    yesNo: card.yes_no,
  };
}

export function getCardByName(name: string): CardMetadata | null {
  const cards = tarotData.cards as any[];
  const card = cards.find((c) => c.name.toLowerCase() === name.toLowerCase());

  if (!card) return null;

  return {
    id: card.id,
    name: card.name,
    suit: getSuitFromId(card.id),
    meaning: card.upright,
    reversedMeaning: card.reversed,
    image: card.image,
    yesNo: card.yes_no,
  };
}

export function getAllCards(): CardMetadata[] {
  const cards = tarotData.cards as any[];
  return cards.map((card) => ({
    id: card.id,
    name: card.name,
    suit: getSuitFromId(card.id),
    meaning: card.upright,
    reversedMeaning: card.reversed,
    image: card.image,
    yesNo: card.yes_no,
  }));
}

export const cardEngine = {
  getCardById,
  getCardByName,
  getAllCards,
};

export default cardEngine;