import { failure, map, Result, success } from '../../types/result';
import { sortBy } from '../../util/arrays';
import { keys } from '../../util/keys';
import { PEA_SHOOTER } from './cannons';
import {
  addFunds,
  Cost,
  COST_FREE,
  MutableCost,
  purchase,
  salePrice,
} from './cost';
import { Item, itemEquals } from './item';

export interface Inventory {
  readonly fuel: number;
  readonly items: readonly Item[];
}

export const EMPTY_INVENTORY: Inventory = {
  fuel: 0,
  items: [],
};

const INITIAL_EARTH_INVENTORY: Inventory = {
  fuel: 3_000,
  items: [],
};

const INITIAL_SHIP_INVENTORY: Inventory = {
  fuel: 0,
  items: [PEA_SHOOTER],
};

export interface GameState {
  readonly earthInventory: Inventory;
  readonly shipInventory: Inventory;
  readonly maxShipItems: number;
  readonly currentScene: string;
  readonly wallet: Cost;
  readonly shipWallet: MutableCost;
}

export const MAX_EQUIPMENT_SLOTS = 15;

export const INITIAL_GAME_STATE: GameState = {
  earthInventory: INITIAL_EARTH_INVENTORY,
  shipInventory: INITIAL_SHIP_INVENTORY,
  currentScene: keys.scenes.cannon,
  maxShipItems: 5,
  wallet: {
    ...COST_FREE,
    gold: 500,
  },
  shipWallet: {
    ...COST_FREE,
  },
};

export const shipStatTotal = (gs: GameState, f: (i: Item) => number): number =>
  gs.shipInventory.items.map(f).reduce((a, b) => a + b, 0);

export const shipHasItem = (gs: GameState, f: (i: Item) => boolean): boolean =>
  gs.shipInventory.items.some(f);

export const goldForAnotherEquipmentSlot = (
  gs: GameState,
): number | undefined => {
  if (gs.maxShipItems === MAX_EQUIPMENT_SLOTS) {
    return undefined;
  }

  return Math.floor(Math.pow(gs.maxShipItems, Math.E)) * 10;
};

export const moveShipWalletToWallet = (gs: GameState): GameState => ({
  ...gs,
  wallet: addFunds(gs.wallet, gs.shipWallet),
  shipWallet: {
    ...COST_FREE,
  },
});

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

export const dequipAll = (gs: GameState): GameState => ({
  ...gs,
  earthInventory: {
    ...gs.earthInventory,
    items: [...gs.earthInventory.items, ...gs.shipInventory.items],
  },
  shipInventory: {
    ...gs.shipInventory,
    items: [],
  },
});

export const buyItem = (
  gameState: GameState,
  item: Item,
): Result<string, GameState> => {
  return map(purchase(gameState.wallet, item.cost), (wallet) => {
    // If we can equip an item right away, do it.
    const equippedItemCount = gameState.shipInventory.items.length;
    if (equippedItemCount < gameState.maxShipItems) {
      return {
        ...gameState,
        wallet,
        shipInventory: addItem(gameState.shipInventory, item),
      };
    }

    // Otherwise, stick it in earth inventory.
    return {
      ...gameState,
      wallet,
      earthInventory: addItem(gameState.earthInventory, item),
    };
  });
};

export const sellItem = (
  gameState: GameState,
  item: Item,
): Result<string, GameState> => {
  const earthItem = gameState.earthInventory.items.find((x) =>
    itemEquals(x, item),
  );
  const shipItem = gameState.shipInventory.items.find((x) =>
    itemEquals(x, item),
  );

  // Sell from earth first, then from the ship if earth doesn't have the item.
  if (earthItem !== undefined) {
    return success({
      ...gameState,
      wallet: addFunds(gameState.wallet, salePrice(item.cost)),
      earthInventory: removeItem(gameState.earthInventory, item),
    });
  }

  if (shipItem !== undefined) {
    return success({
      ...gameState,
      wallet: addFunds(gameState.wallet, salePrice(item.cost)),
      shipInventory: removeItem(gameState.shipInventory, item),
    });
  }

  return failure("Can't sell item, no item in inventory!");
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

const removeOne = (ts: readonly Item[], t: Item): readonly Item[] => {
  const newArray: Item[] = [];

  let oneRemoved = false;
  for (const element of ts) {
    if (itemEquals(element, t) && !oneRemoved) {
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
