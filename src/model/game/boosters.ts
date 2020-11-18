import { EMPTY_ITEM, Item, ItemType } from './item';

export interface Booster extends Item {
  readonly type: ItemType.BOOSTER;
}

export const CRAPPY_BOOSTER: Booster = {
  ...EMPTY_ITEM,
  type: ItemType.BOOSTER,
  name: 'Crappy booster',
  boosters: 1,
};
