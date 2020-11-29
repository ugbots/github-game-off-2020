import { generateArray } from '../../util/arrays';
import { choose } from '../../util/random';
import {
  Direction,
  directionOffset,
  DIRECTIONS,
  oppositeDirection,
} from './direction';

export interface Node {
  x: number;
  y: number;
  exits: Map<Direction, Node>;
}

export const generate = (width: number, height: number): readonly Node[][] => {
  const visited: (Node | undefined)[][] = [
    ...generateArray(width, () => [...generateArray(height, () => undefined)]),
  ];

  let current: Node = {
    x: Math.floor(Math.random() * width),
    y: Math.floor(Math.random() * height),
    exits: new Map(),
  };

  const path = [current];

  while (path.length > 0) {
    let exits = [...DIRECTIONS];
    let newNode: Node | undefined;
    while (exits.length > 0) {
      const exit = choose(exits);
      // Does this room already have this exit?
      if (current.exits.has(exit)) {
        exits = exits.filter((x) => x !== exit);
        continue;
      }

      const exitOffset = directionOffset(exit);
      const exitCoords = {
        x: current.x + exitOffset[0],
        y: current.y + exitOffset[1],
      };

      // Is this exit in bounds?
      if (
        exitCoords.x >= width ||
        exitCoords.x < 0 ||
        exitCoords.y >= height ||
        exitCoords.y < 0
      ) {
        exits = exits.filter((x) => x !== exit);
        continue;
      }

      // Has another node visited this exit?
      if (visited[exitCoords.x][exitCoords.y] !== undefined) {
        exits = exits.filter((x) => x !== exit);
        continue;
      }

      // Otherwise, hook these exits up.
      newNode = {
        ...exitCoords,
        exits: new Map().set(oppositeDirection(exit), current),
      };
      visited[newNode.x][newNode.y] = newNode;

      current.exits.set(exit, newNode);
      path.push(newNode);
      break;
    }

    if (newNode !== undefined) {
      path.push(newNode);
      current = newNode;
    } else {
      path.pop();
      current = path[path.length - 1];
    }
  }

  return visited as Node[][];
};
