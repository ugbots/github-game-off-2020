import { COST_FREE } from './cost';
import { EMPTY_ITEM, Item, ItemType, Rarity } from './item';

export interface Cannon extends Item {
  readonly type: ItemType.CANNON;
}

export const PEA_SHOOTER: Cannon = {
  ...EMPTY_ITEM,
  rarity: Rarity.COMMON,
  type: ItemType.CANNON,
  imageUrl: 'assets/sprites/pea_shooter.png',
  description:
    'This might be able to volley the ship to the closest ' +
    'asteorids in the belt. Only one way to find out!',
  name: 'Pea shooter',
  maxCannonPower: 20,
  cost: COST_FREE,
};

export const HOWITZER: Cannon = {
  ...EMPTY_ITEM,
  type: ItemType.CANNON,
  rarity: Rarity.UNCOMMON,
  imageUrl: 'assets/sprites/howitzer.png',
  description:
    'An old cannon we found in the museum. Looks like it can pack a punch!',
  name: 'Howitzer',
  maxCannonPower: 40,
  cost: {
    ...COST_FREE,
    gold: 1000,
  },
};

export const BIG_BERTHA: Cannon = {
  ...EMPTY_ITEM,
  type: ItemType.CANNON,
  rarity: Rarity.RARE,
  imageUrl: 'assets/sprites/big_bertha.png',
  description: 'The name says it all.',
  name: 'Big Bertha',
  maxCannonPower: 60,
  cost: {
    ...COST_FREE,
    emerald: 2_000,
  },
};

export const GUSTAV: Cannon = {
  ...EMPTY_ITEM,
  type: ItemType.CANNON,
  rarity: Rarity.EPIC,
  imageUrl: 'assets/sprites/gustav.png',
  description:
    "We found this gun mounted on a train in the dump. It's a big one!",
  name: 'Gustav',
  maxCannonPower: 80,
  cost: {
    ...COST_FREE,
    sapphire: 3_000,
  },
};

export const M65_ATOMIC_CANNON: Cannon = {
  ...EMPTY_ITEM,
  type: ItemType.CANNON,
  rarity: Rarity.LEGENDARY,
  imageUrl: 'assets/sprites/m65_atomic_cannon.png',
  description: 'What do you need that for? Going to war with an alien race?',
  name: 'M65 atomic cannon',
  maxCannonPower: 100,
  cost: {
    ...COST_FREE,
    ruby: 4_000,
  },
};

export const ALL_CANNONS: readonly Cannon[] = [
  PEA_SHOOTER,
  HOWITZER,
  BIG_BERTHA,
  GUSTAV,
  M65_ATOMIC_CANNON,
];

export const CANNON_HELP =
  "Cannons launch you further into space. It's best to upgrade your cannon " +
  'as soon as you can.';
