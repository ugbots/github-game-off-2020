import { ALL_BATTERIES } from './batteries';
import { ALL_BOOSTERS } from './boosters';
import { ALL_DRILLS } from './drills';
import { ALL_STABILIZERS } from './stabilizers';
import { Item } from './item';
import { ALL_CANNONS } from './cannons';
import { ALL_RADARS } from './radars';
import { ALL_SHIP_UPGRADES } from './ship_upgrades';

export const ALL_ITEMS: readonly Item[] = [
  ...ALL_DRILLS,
  ...ALL_BATTERIES,
  ...ALL_BOOSTERS,
  ...ALL_STABILIZERS,
  ...ALL_CANNONS,
  ...ALL_RADARS,
  ...ALL_SHIP_UPGRADES,
];
