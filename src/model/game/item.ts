import { Cost, COST_FREE } from './cost';

export enum ItemType {
  DRILL,
  BOOSTER,
  BATTERY,
  STABILIZER,
  CANNON,
  RADAR,
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
  readonly maxCannonPower: number;
  /** If true, this item shows you what direction the moon is in. */
  readonly moonRadar: boolean;
  /** If true, shows asteroid indicators on the flight scene. */
  readonly asteroidRadar: boolean;
  /** The higher this is, the less battery used when detection Fool's Gold. */
  readonly foolsGoldRadar: number;
}

export const EMPTY_ITEM = {
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
  maxCannonPower: 0,
  moonRadar: false,
  asteroidRadar: false,
  foolsGoldRadar: 0,
};

export const itemEquals = (a: Item, b: Item): boolean => a.name === b.name;
