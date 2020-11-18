export enum ItemType {
  DRILL,
  BOOSTER,
  BATTERY,
}

export interface Item {
  readonly type: ItemType;
  readonly name: string;
  readonly drills: number;
  readonly boosters: number;
  readonly batteries: number;
}

export const EMPTY_ITEM = {
  drills: 0,
  boosters: 0,
  batteries: 0,
};
