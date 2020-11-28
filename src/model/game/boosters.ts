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

export const ALL_BOOSTERS: readonly Booster[] = [
  MODEL_ROCKET_ENGINE,
];
