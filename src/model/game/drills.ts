import { EMPTY_ITEM, Item, ItemType } from './item';

export interface Drill extends Item {
  readonly type: ItemType.DRILL;
}

export const isDrill = (item: Item): item is Drill =>
  item.type === ItemType.DRILL;

export const CRAPPY_DRILL: Drill = {
  ...EMPTY_ITEM,
  type: ItemType.DRILL,
  name: 'Crappy drill',
  drills: 1,
};

export const BETTER_DRILL: Drill = {
  ...EMPTY_ITEM,
  type: ItemType.DRILL,
  name: 'Better drill',
  drills: 3,
};
