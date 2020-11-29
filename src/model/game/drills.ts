import { COST_FREE } from './cost';
import { EMPTY_ITEM, Item, ItemType, Rarity } from './item';

export interface Drill extends Item {
  readonly type: ItemType.DRILL;
}

export const isDrill = (item: Item): item is Drill =>
  item.type === ItemType.DRILL;

export const COPPER_DRILL: Drill = {
  ...EMPTY_ITEM,
  type: ItemType.DRILL,
  rarity: Rarity.COMMON,
  name: 'Copper drill',
  drills: 1,
  cost: {
    ...COST_FREE,
    gold: 100,
  },
};

export const IRON_DRILL: Drill = {
  ...EMPTY_ITEM,
  type: ItemType.DRILL,
  rarity: Rarity.UNCOMMON,
  name: 'Iron drill',
  drills: 2,
  cost: {
    ...COST_FREE,
    gold: 1_000,
  },
};

export const BRONZE_DRILL: Drill = {
  ...EMPTY_ITEM,
  type: ItemType.DRILL,
  rarity: Rarity.RARE,
  name: 'Bronze drill',
  drills: 3,
  cost: {
    ...COST_FREE,
    gold: 1_000,
    emerald: 300,
  },
};

export const TITANIUM_DRILL: Drill = {
  ...EMPTY_ITEM,
  type: ItemType.DRILL,
  rarity: Rarity.EPIC,
  name: 'Titanium drill',
  drills: 5,
  cost: {
    ...COST_FREE,
    gold: 1_000,
    sapphire: 1_000,
  },
};

export const DIAMOND_DRILL: Drill = {
  ...EMPTY_ITEM,
  type: ItemType.DRILL,
  rarity: Rarity.LEGENDARY,
  name: 'Diamond drill',
  drills: 10,
  cost: {
    ...COST_FREE,
    gold: 3_000,
    ruby: 500,
  },
};

export const ALL_DRILLS: readonly Drill[] = [
  COPPER_DRILL,
  IRON_DRILL,
  BRONZE_DRILL,
  TITANIUM_DRILL,
  DIAMOND_DRILL,
];

export const DRILL_HELP =
  'Drills decrease the time it takes to mine resources on asteroids.';
