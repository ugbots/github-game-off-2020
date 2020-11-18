import { Inventory } from './game_state';
import { Item } from './item';

export interface ShipStats {
  readonly drills: number;
}

export const getShipStats = (inv: Inventory): ShipStats => ({
  drills: sumItemsByGetter(inv, (x) => x.drills),
});

const sumItemsByGetter = (inv: Inventory, getter: (i: Item) => number) =>
  inv.items.map(getter).reduce((a, b) => a + b, 0);

export const getDiff = (prev: Inventory, next: Inventory): ShipStats => {
  const prevStats = getShipStats(prev);
  const nextStats = getShipStats(next);

  return {
    drills: nextStats.drills - prevStats.drills,
  };
};
