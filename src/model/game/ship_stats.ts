import { Inventory } from './game_state';
import { Item } from './item';

export interface ShipStats {
  readonly drills: number;
  readonly boosters: number;
  readonly batteries: number;
  readonly stabilizers: number;
  readonly maxCannonPower: number;
  readonly moonRadar: boolean;
}

export const getShipStats = (inv: Inventory): ShipStats => ({
  batteries: sumItemsByGetter(inv, (x) => x.batteries),
  drills: sumItemsByGetter(inv, (x) => x.drills),
  boosters: sumItemsByGetter(inv, (x) => x.boosters),
  stabilizers: sumItemsByGetter(inv, (x) => x.stabilizers),
  maxCannonPower: sumItemsByGetter(inv, (x) => x.maxCannonPower),
  moonRadar: orItemsByGetter(inv, (x) => x.moonRadar),
});

const sumItemsByGetter = (
  inv: Inventory,
  getter: (i: Item) => number,
): number => inv.items.map(getter).reduce((a, b) => a + b, 0);

const orItemsByGetter = (
  inv: Inventory,
  getter: (i: Item) => boolean,
): boolean => inv.items.some(getter);

export const getDiff = (prev: Inventory, next: Inventory): ShipStats => {
  const prevStats = getShipStats(prev);
  const nextStats = getShipStats(next);

  return {
    drills: nextStats.drills - prevStats.drills,
    boosters: nextStats.boosters - prevStats.boosters,
    batteries: nextStats.batteries - prevStats.batteries,
    stabilizers: nextStats.stabilizers - prevStats.stabilizers,
    maxCannonPower: nextStats.maxCannonPower - prevStats.maxCannonPower,
    moonRadar: nextStats.moonRadar,
  };
};
