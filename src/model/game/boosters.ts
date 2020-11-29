import { COST_FREE } from './cost';
import { EMPTY_ITEM, Item, ItemType, Rarity } from './item';

export interface Booster extends Item {
  readonly type: ItemType.BOOSTER;
}

export const MODEL_ROCKET_ENGINE: Booster = {
  ...EMPTY_ITEM,
  rarity: Rarity.COMMON,
  type: ItemType.BOOSTER,
  name: 'Model rocket engine',
  description: "This can take any rocket to the moon, as long as it's small.",
  boosters: 1,
  cost: {
    ...COST_FREE,
    gold: 100,
  },
};

export const DIESEL_BOOSTER: Booster = {
  ...EMPTY_ITEM,
  rarity: Rarity.UNCOMMON,
  type: ItemType.BOOSTER,
  name: 'Diesel booster',
  description:
    'Launch yourself skyward with the stored chemical energy of liquid' +
    'dinosaurs. Not eco-friendly, but dang this baby purrs.',
  boosters: 2,
  cost: {
    ...COST_FREE,
    gold: 1000,
  },
};

export const LIQUID_OXYGEN_BOOSTER: Booster = {
  ...EMPTY_ITEM,
  rarity: Rarity.RARE,
  type: ItemType.BOOSTER,
  name: 'Liquid oxygen booster',
  description:
    'Uses a compressed volatile mixture to achieve superior space scoots.',
  boosters: 3,
  cost: {
    ...COST_FREE,
    gold: 1_000,
    emerald: 1_000,
  },
};

export const ION_ENGINE: Booster = {
  ...EMPTY_ITEM,
  rarity: Rarity.EPIC,
  type: ItemType.BOOSTER,
  name: 'Ion Engine',
  description:
    'Stolen Imperial tech allows for maximum propulsion without chemical fuel, ' +
    'but at what cost?',
  boosters: 6,
  cost: {
    ...COST_FREE,
    gold: 1_500,
    sapphire: 800,
  },
};

export const ALL_BOOSTERS: readonly Booster[] = [
  MODEL_ROCKET_ENGINE,
  DIESEL_BOOSTER,
  LIQUID_OXYGEN_BOOSTER,
  ION_ENGINE,
];
