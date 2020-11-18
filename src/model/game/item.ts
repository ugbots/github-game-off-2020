export enum ItemType {
  DRILL,
}

export interface Item {
  readonly type: ItemType;
  readonly name: string;
  readonly drills: number;
}
