import { COST_FREE } from './cost';
import { EMPTY_ITEM, Item, ItemType, Rarity } from './item';

export interface Radar extends Item {
  readonly type: ItemType.RADAR;
}

export const TELESCOPE: Radar = {
  ...EMPTY_ITEM,
  rarity: Rarity.LEGENDARY,
  type: ItemType.RADAR,
  imageUrl: 'assets/sprites/telescope.png',
  name: 'Telescope',
  description:
    'Our brightest minds at Splinter Labs came up with this device to reveal ' +
    'the current location of the moon. What will they think of next?',
  moonRadar: true,
  cost: {
    ...COST_FREE,
    ruby: 500,
  },
};

export const VOID_SONAR: Radar = {
  ...EMPTY_ITEM,
  rarity: Rarity.RARE,
  type: ItemType.RADAR,
  imageUrl: 'assets/sprites/void_sonar.png',
  name: 'Void sonar',
  description:
    'This device sends sound waves through space to find the closest ' +
    'asteroid.',
  asteroidRadar: true,
  cost: {
    ...COST_FREE,
    gold: 2_000,
    emerald: 1_000,
  },
};

export const QUANTUM_WIBBLY: Radar = {
  ...EMPTY_ITEM,
  rarity: Rarity.EPIC,
  type: ItemType.RADAR,
  imageUrl: 'assets/sprites/quantum_wibbly.png',
  name: 'Quantum Wibbly',
  description:
    "Don't be a fool! Look through this device on an astreoid to see Fool's " +
    "Gold. Activate with 'z'. Drains your battery, but equipping the more " +
    'you equip, the slower it drains.',
  foolsGoldRadar: 1,
  cost: {
    ...COST_FREE,
    emerald: 1_000,
    sapphire: 1_000,
  },
};

export const ALL_RADARS: readonly Radar[] = [
  VOID_SONAR,
  QUANTUM_WIBBLY,
  TELESCOPE,
];

export const RADAR_HELP =
  'Radar items give more information about the world around you. Read their ' +
  'descriptions for more details.';
