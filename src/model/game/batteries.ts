import { EMPTY_ITEM, Item, ItemType } from './item';

export interface Battery extends Item {
  readonly type: ItemType.BATTERY;
}

export const CRAPPY_BATTERY: Battery = {
  ...EMPTY_ITEM,
  type: ItemType.BATTERY,
  name: 'Crappy battery',
  batteries: 1,
};

export const LITHIUM_ION_BATTERY: Battery = {
  ...EMPTY_ITEM,
  type: ItemType.BATTERY,
  description: "It's rechargeable!",
  name: 'Lithium ion battery',
  batteries: 3,
};

export const COBALT_FUEL_ROD: Battery = {
  ...EMPTY_ITEM,
  type: ItemType.BATTERY,
  description: 'Be careful with this one!',
  name: 'Cobalt fuel rod',
  batteries: 10,
};

export const ALL_BATTERIES: readonly Battery[] = [
  CRAPPY_BATTERY,
  LITHIUM_ION_BATTERY,
  COBALT_FUEL_ROD,
];
