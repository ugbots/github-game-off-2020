import { COST_FREE } from './cost';
import { EMPTY_ITEM, Item, ItemType, Rarity } from './item';

export interface Cannon extends Item {
  readonly type: ItemType.CANNON;
}

export const COPPER_CANNON: Cannon = {
  ...EMPTY_ITEM,
  type: ItemType.CANNON,
  name: 'Copper cannon',
  maxCannonPower: 20,
  cost: COST_FREE,
};

export const HOWITZER: Cannon = {
  ...EMPTY_ITEM,
  rarity: Rarity.UNCOMMON,
  type: ItemType.CANNON,
  description:
    'An old cannon we found in the museum. Looks like it can pack a punch!',
  name: 'Howitzer',
  maxCannonPower: 40,
  cost: {
    ...COST_FREE,
    gold: 1000,
  },
};

export const ALL_CANNONS: readonly Cannon[] = [COPPER_CANNON, HOWITZER];
