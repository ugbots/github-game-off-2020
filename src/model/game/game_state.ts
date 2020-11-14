import { failure, Result, success } from '../../types/result';
import { Unit, UNIT } from '../../types/unit';
import { sortBy } from '../../util/arrays';
import { BETTER_DRILL, CRAPPY_DRILL, Drill } from './drills';
import { isDrill, Item } from './item';

export interface Inventory {
  fuel: number;
  readonly drills: readonly Drill[];
}

const INITIAL_EARTH_INVENTORY: Inventory = {
  fuel: 20,
  drills: [CRAPPY_DRILL, BETTER_DRILL],
};

const INITIAL_SHIP_INVENTORY: Inventory = {
  fuel: 0,
  drills: [CRAPPY_DRILL],
};

export interface GameState {
  readonly earthInventory: Inventory;
  readonly shipInventory: Inventory;
}

export const INITIAL_GAME_STATE: GameState = {
  earthInventory: INITIAL_EARTH_INVENTORY,
  shipInventory: INITIAL_SHIP_INVENTORY,
};

export const equipItem = (gs: GameState, item: Item): GameState => {
  const source = gs.earthInventory;
  const dest = gs.shipInventory;

  const [newEarthInv, newShipInv] = moveItem(source, dest, item);

  return {
    ...gs,
    earthInventory: newEarthInv,
    shipInventory: newShipInv,
  };
};

export const dequipItem = (gs: GameState, item: Item): GameState => {
  const source = gs.shipInventory;
  const dest = gs.earthInventory;

  const [newShipInv, newEarthInv] = moveItem(source, dest, item);

  return {
    ...gs,
    earthInventory: newEarthInv,
    shipInventory: newShipInv,
  };
};

const moveItem = (
  source: Inventory,
  dest: Inventory,
  item: Item,
): [Inventory, Inventory] => [removeItem(source, item), addItem(dest, item)];

const removeItem = (inv: Inventory, item: Item): Inventory => {
  if (isDrill(item)) {
    return {
      ...inv,
      drills: sortBy(removeOne(inv.drills, item), (x) => x.name),
    };
  }

  throw new Error("Can't remove item: Can't determine item type.");
};

const addItem = (inv: Inventory, item: Item): Inventory => {
  if (isDrill(item)) {
    return {
      ...inv,
      drills: sortBy([...inv.drills, item], (x) => x.name),
    };
  }

  throw new Error("Can't add item: Can't determine item type.");
};

const removeOne = <T>(ts: readonly T[], t: T): readonly T[] => {
  const newArray = [];

  let oneRemoved = false;
  for (const element of ts) {
    if (element === t && !oneRemoved) {
      oneRemoved = true;
      continue;
    }

    newArray.push(element);
  }

  if (!oneRemoved) {
    throw new Error("Can't remove from array: not found!");
  }

  return newArray;
};
