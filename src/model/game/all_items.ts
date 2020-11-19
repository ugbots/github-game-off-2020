import { CRAPPY_BATTERY } from './batteries';
import { CRAPPY_BOOSTER } from './boosters';
import { ALL_DRILLS } from './drills';
import { Item } from './item';

export const ALL_ITEMS: readonly Item[] = [
  ...ALL_DRILLS,
  CRAPPY_BATTERY,
  CRAPPY_BOOSTER,
];
