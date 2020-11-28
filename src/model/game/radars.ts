import { COST_FREE } from './cost';
import { EMPTY_ITEM, Item, ItemType } from './item';

export interface Radar extends Item {
  readonly type: ItemType.RADAR;
}

export const TELESCOPE: Radar = {
  ...EMPTY_ITEM,
  type: ItemType.RADAR,
  name: 'Telescope',
  description:
    'Our brightest minds at Splinter Labs came up with this device to reveal ' +
    'the current location of the moon. What will they think of next?',
  moonRadar: true,
  cost: {
    ...COST_FREE,
    emerald: 500,
  },
};

export const VOID_SONAR: Radar = {
  ...EMPTY_ITEM,
  type: ItemType.RADAR,
  name: 'Void sonar',
  description:
    'This device sends sound waves through space to find the closest ' +
    'asteroid.',
  asteroidRadar: true,
  cost: {
    ...COST_FREE,
    gold: 2_000,
    emerald: 1_000,
  },
};

export const QUANTUM_WIBBLY: Radar = {
  ...EMPTY_ITEM,
  type: ItemType.RADAR,
  name: 'Quantum Wibbly',
  description:
    "Look through this goofy device to see Fool's Gold. I'm no fool!",
  foolsGoldRadar: 1,
  cost: {
    ...COST_FREE,
    emerald: 1_000,
    sapphire: 1_000,
  },
};

export const ALL_RADARS: readonly Radar[] = [
  TELESCOPE,
  VOID_SONAR,
  QUANTUM_WIBBLY,
];
