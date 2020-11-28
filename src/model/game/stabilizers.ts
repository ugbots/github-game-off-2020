import { COST_FREE } from './cost';
import { EMPTY_ITEM, Item, ItemType, Rarity } from './item';

export interface Stabilizer extends Item {
  readonly type: ItemType.STABILIZER;
}

export const CARDBOARD_FINS: Stabilizer = {
  ...EMPTY_ITEM,
  type: ItemType.STABILIZER,
  rarity: Rarity.COMMON,
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
  name: 'Aluminum flaps',
  description: "Stolen from the air field. They won't miss these.",
  stabilizers: 2,
  cost: {
    ...COST_FREE,
    gold: 5_000,
    emerald: 500,
  },
};

export const SUB_QUANTUM_GYRO: Stabilizer = {
  ...EMPTY_ITEM,
  type: ItemType.STABILIZER,
  rarity: Rarity.LEGENDARY,
  name: 'Sub-quantum gyro',
  description: 'Experience true level.',
  stabilizers: 10,
  cost: {
    ...COST_FREE,
    gold: 10_000,
    ruby: 500,
  },
};

export const ALL_STABILIZERS: readonly Stabilizer[] = [
  CARDBOARD_FINS,
  ALUMINUM_FLAPS,
  SUB_QUANTUM_GYRO,
];
