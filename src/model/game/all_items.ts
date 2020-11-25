import { ALL_BATTERIES } from './batteries';
import { CRAPPY_BOOSTER } from './boosters';
import { ALL_DRILLS } from './drills';
import { ALL_STABILIZERS } from './stabilizers';
import { Item } from './item';
import { ALL_CANNONS } from './cannons';

export const ALL_ITEMS: readonly Item[] = [
  ...ALL_DRILLS,
  ...ALL_BATTERIES,
  CRAPPY_BOOSTER,
  ...ALL_STABILIZERS,
  ...ALL_CANNONS,
];
