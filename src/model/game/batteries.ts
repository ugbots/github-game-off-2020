import { COST_FREE } from './cost';
import { EMPTY_ITEM, Item, ItemType, Rarity } from './item';

export interface Battery extends Item {
  readonly type: ItemType.BATTERY;
}

export const NINE_VOLT_BATTERY: Battery = {
  ...EMPTY_ITEM,
  rarity: Rarity.COMMON,
  type: ItemType.BATTERY,
  imageUrl: 'assets/sprites/nine_volt_battery.png',
  name: '9-Volt',
  description: 'A great solution if you only need a little juice.',
  batteries: 1,
  cost: {
    ...COST_FREE,
    gold: 100,
  },
};

export const CAR_BATTERY: Battery = {
  ...EMPTY_ITEM,
  rarity: Rarity.UNCOMMON,
  type: ItemType.BATTERY,
  imageUrl: 'assets/sprites/car_battery.png',
  name: 'Car battery',
  description: 'Acidic!',
  batteries: 2,
  cost: {
    ...COST_FREE,
    gold: 1_500,
    emerald: 400,
  },
};

export const ELLEN_DEGENERATOR: Battery = {
  ...EMPTY_ITEM,
  rarity: Rarity.RARE,
  type: ItemType.BATTERY,
  imageUrl: 'assets/sprites/ellen_degenerator.png',
  name: 'Ellen DeGenerator',
  description: 'This bad boy runs on toxic energy.',
  batteries: 3,
  cost: {
    ...COST_FREE,
    gold: 2_000,
    sapphire: 500,
  },
};

export const COBALT_FUEL_ROD: Battery = {
  ...EMPTY_ITEM,
  rarity: Rarity.EPIC,
  type: ItemType.BATTERY,
  imageUrl: 'assets/sprites/cobalt_fuel_rod.png',
  name: 'Cobalt fuel rod',
  description: 'Be careful with this one!',
  batteries: 10,
  cost: {
    ...COST_FREE,
    gold: 3_000,
    ruby: 500,
  },
};

export const ALL_BATTERIES: readonly Battery[] = [
  NINE_VOLT_BATTERY,
  CAR_BATTERY,
  ELLEN_DEGENERATOR,
  COBALT_FUEL_ROD,
];

export const BATTERY_HELP =
  'Batteries increase the time you have to mine on an asteroid.';
