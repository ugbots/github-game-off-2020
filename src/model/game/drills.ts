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
  imageUrl: 'assets/sprites/copper_drill.png',
  name: 'Copper drill',
  description:
    'We had to do a lot to this drill to keep it from falling apart.',
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
  imageUrl: 'assets/sprites/iron_drill.png',
  name: 'Iron drill',
  description: 'Trusty iron. A little heavy, but never fails!',
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
  imageUrl: 'assets/sprites/bronze_drill.png',
  name: 'Bronze drill',
  description: 'Cuts like a hot knife through butter.',
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
  imageUrl: 'assets/sprites/titanium_drill.png',
  name: 'Titanium drill',
  description:
    'Finally, a drill made from a material you might actually make a drill ' +
    'out of.',
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
  imageUrl: 'assets/sprites/diamond_drill.png',
  name: 'Diamond drill',
  description: "Don't go cutting through any diamonds with this!",
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
