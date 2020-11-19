import { CommonModule } from "@angular/common";

export enum ItemType {
  DRILL,
  BOOSTER,
  BATTERY,
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
  readonly drills: number;
  readonly boosters: number;
  readonly batteries: number;
}

export const EMPTY_ITEM = {
  rarity: Rarity.COMMON,
  imageUrl: 'assets/sprites/character.png',
  drills: 0,
  boosters: 0,
  batteries: 0,
};
