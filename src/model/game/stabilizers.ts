import { COST_FREE } from './cost';
import { EMPTY_ITEM, Item, ItemType, Rarity } from './item';

export interface Stabilizer extends Item {
  readonly type: ItemType.STABILIZER;
}

export const CARDBOARD_FINS: Stabilizer = {
  ...EMPTY_ITEM,
  type: ItemType.STABILIZER,
  rarity: Rarity.COMMON,
  imageUrl: 'assets/sprites/cardboard_fins.png',
  name: 'Cardboard fins',
  description: "Made from Tony's pizza boxes.",
  stabilizers: 1,
  cost: {
    ...COST_FREE,
    gold: 100,
  },
};

export const ALUMINUM_FLAPS: Stabilizer = {
  ...EMPTY_ITEM,
  type: ItemType.STABILIZER,
  rarity: Rarity.UNCOMMON,
  imageUrl: 'assets/sprites/aluminum_flaps.png',
  name: 'Aluminum flaps',
  description: "Stolen from the air field. They won't miss these.",
  stabilizers: 2,
  cost: {
    ...COST_FREE,
    gold: 2_000,
    emerald: 500,
  },
};

export const SUB_QUANTUM_GYRO: Stabilizer = {
  ...EMPTY_ITEM,
  type: ItemType.STABILIZER,
  rarity: Rarity.LEGENDARY,
  imageUrl: 'assets/sprites/sub_quantum_gyro.png',
  name: 'Sub-quantum gyro',
  description: 'Experience true level.',
  stabilizers: 10,
  cost: {
    ...COST_FREE,
    gold: 3_000,
    ruby: 500,
  },
};

export const ALL_STABILIZERS: readonly Stabilizer[] = [
  CARDBOARD_FINS,
  ALUMINUM_FLAPS,
  SUB_QUANTUM_GYRO,
];

export const STABILIZER_HELP =
  'Stabilizers help aim you ship when trying to land on an asteroid.';
