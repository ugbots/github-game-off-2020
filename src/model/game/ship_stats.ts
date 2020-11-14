import { Inventory } from './game_state';

export interface ShipStats {
  readonly drills: number;
}

export const getShipStats = (inv: Inventory): ShipStats => ({
  drills: inv.drills.map((x) => x.power).reduce((a, b) => a + b, 0),
});

export const getDiff = (prev: Inventory, next: Inventory): ShipStats => {
  const prevStats = getShipStats(prev);
  const nextStats = getShipStats(next);

  return {
    drills: nextStats.drills - prevStats.drills,
  };
};
