import { Drill } from './drills';

export type Item = Drill;

export const isDrill = (item: Item): item is Drill => item.kind === 'Drill';
