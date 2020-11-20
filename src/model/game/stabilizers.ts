import { COST_FREE } from './cost';
import { EMPTY_ITEM, Item, ItemType } from './item';

export interface Stabilizer extends Item {
  readonly type: ItemType.STABILIZER;
}

export const CRAPPY_STABILIZER: Stabilizer = {
  ...EMPTY_ITEM,
  name: 'Crappy stabilizer',
  type: ItemType.STABILIZER,
  stabilizers: 1,
  cost: {
    ...COST_FREE,
    gold: 20,
  },
};

export const ALL_STABILIZERS: readonly Stabilizer[] = [CRAPPY_STABILIZER];
