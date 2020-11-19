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
};

export const IRON_DRILL: Drill = {
  ...EMPTY_ITEM,
  type: ItemType.DRILL,
  rarity: Rarity.COMMON,
  name: 'Iron drill',
  drills: 3,
};

export const BRONZE_DRILL: Drill = {
  ...EMPTY_ITEM,
  type: ItemType.DRILL,
  rarity: Rarity.UNCOMMON,
  name: 'Bronze drill',
  drills: 5,
};

export const TITANIUM_DRILL: Drill = {
  ...EMPTY_ITEM,
  type: ItemType.DRILL,
  rarity: Rarity.EPIC,
  name: 'Titanium drill',
  drills: 5,
};

export const DIAMOND_DRILL: Drill = {
  ...EMPTY_ITEM,
  type: ItemType.DRILL,
  rarity: Rarity.LEGENDARY,
  name: 'Diamond drill',
  drills: 5,
};

export const ALL_DRILLS: readonly Drill[] = [
  COPPER_DRILL,
  IRON_DRILL,
  BRONZE_DRILL,
  TITANIUM_DRILL,
  DIAMOND_DRILL,
];
