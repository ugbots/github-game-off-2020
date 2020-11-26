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

export const ALL_RADARS: readonly Radar[] = [TELESCOPE];
