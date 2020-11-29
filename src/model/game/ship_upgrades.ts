import { map, Result } from '../../types/result';
import { Cost, COST_FREE, purchase } from './cost';
import { GameState, goldForAnotherEquipmentSlot } from './game_state';
import { EMPTY_ITEM, Item, ItemType, Rarity } from './item';

export interface ShipUpgrade extends Item {
  readonly type: ItemType.SHIP_UPGRADE;
}

export const EQUIPMENT_SLOT: ShipUpgrade = {
  ...EMPTY_ITEM,
  type: ItemType.SHIP_UPGRADE,
  rarity: Rarity.COMMON,
  imageUrl: 'assets/sprites/equipment_slot.png',
  name: 'Equipment slot',
  description:
    'Adds an additional equipment slot to your ship, so you can ' +
    'equip more items.',
  equipmentSlots: 1,
  costFn: (gs: GameState) => {
    const gold = goldForAnotherEquipmentSlot(gs);
    if (gold === undefined) {
      return undefined;
    }

    return {
      ...COST_FREE,
      gold,
    };
  },
  handleBuy: (gs: GameState, cost: Cost): Result<string, GameState> =>
    map(purchase(gs.wallet, cost), (wallet) => ({
      ...gs,
      maxShipItems: gs.maxShipItems + 1,
      wallet,
    })),
};

export const ALL_SHIP_UPGRADES = [EQUIPMENT_SLOT];

export const SHIP_UPGRADE_HELP = 'Upgrade your ship with these items.';
