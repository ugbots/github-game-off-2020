import { Cost, COST_FREE } from './cost';

export enum ItemType {
  DRILL,
  BOOSTER,
  BATTERY,
  STABILIZER,
}

export enum Rarity {
  COMMON,
  UNCOMMON,
  RARE,
  EPIC,
  LEGENDARY,
}

export interface Item {
  readonly type: ItemType;
  readonly rarity: Rarity;
  readonly name: string;
  readonly imageUrl: string;
  readonly description: string;
  readonly cost: Cost;
  readonly drills: number;
  readonly boosters: number;
  readonly batteries: number;
  readonly stabilizers: number;
}

export const EMPTY_ITEM = {
  rarity: Rarity.COMMON,
  imageUrl: 'assets/sprites/character.png',
  description:
    'Here is the description for an item. Boy, it can be really ' +
    'long. Who knows what items this game might have? Better ' +
    'build some more so we can get rid of this sample text!',
  cost: COST_FREE,
  drills: 0,
  boosters: 0,
  batteries: 0,
  stabilizers: 0,
};

export const itemEquals = (a: Item, b: Item): boolean => a.name === b.name;
