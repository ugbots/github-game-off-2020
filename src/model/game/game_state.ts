import { failure, Result, success } from '../../types/result';
import { Unit, UNIT } from '../../types/unit';
import { sortBy } from '../../util/arrays';
import { CRAPPY_BATTERY } from './batteries';
import { CRAPPY_BOOSTER } from './boosters';
import { BETTER_DRILL, CRAPPY_DRILL, Drill, isDrill } from './drills';
import { Item } from './item';

export interface Inventory {
  readonly fuel: number;
  readonly items: readonly Item[];
}

export const EMPTY_INVENTORY: Inventory = {
  fuel: 0,
  items: [],
};

const INITIAL_EARTH_INVENTORY: Inventory = {
  fuel: 20,
  items: [CRAPPY_DRILL, BETTER_DRILL, CRAPPY_BOOSTER, CRAPPY_BATTERY],
};

const INITIAL_SHIP_INVENTORY: Inventory = {
  fuel: 0,
  items: [CRAPPY_DRILL, CRAPPY_BOOSTER, CRAPPY_BATTERY],
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

const removeItem = (inv: Inventory, item: Item): Inventory => ({
  ...inv,
  items: sortBy(removeOne(inv.items, item), (x) => x.name),
});

const addItem = (inv: Inventory, item: Item): Inventory => ({
  ...inv,
  items: sortBy([...inv.items, item], (x) => x.name),
});

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
