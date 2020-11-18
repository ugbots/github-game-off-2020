import { EMPTY_ITEM, Item, ItemType } from "./item";

export interface Battery extends Item {
  readonly type: ItemType.BATTERY;
}

export const CRAPPY_BATTERY: Battery = {
  ...EMPTY_ITEM,
  type: ItemType.BATTERY,
  name: 'Crappy battery',
  batteries: 1,
};
