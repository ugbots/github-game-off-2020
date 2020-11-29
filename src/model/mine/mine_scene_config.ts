import { Scene } from 'phaser';
import {
  easeInQuint,
  EasingButton,
  EasingDirection,
  linear,
} from '../../math/easing';
import { keys } from '../../util/keys';
import { CursorKeys, Vector2 } from '../../util/phaser_types';
import { choose } from '../../util/random';
import { COST_FREE, truncateCost } from '../game/cost';
import { GameState, shipStatTotal } from '../game/game_state';
import { LootSceneInput } from '../loot/loot_scene_input';
import { Direction, directionOffset } from './direction';
import { MineSceneInput } from './mine_scene_input';
import { generateRooms, getRandomEmptySpace, Room, TILE_SIZE } from './room';
import { isMineable, isWalkable, Tile, TileResource, TileType } from './tile';

export enum ShipState {
  MOVING,
  MINING,
}

export interface MineShipConfig {
  readonly position: Vector2;
  readonly batteryEasing: EasingButton;
  readonly foolsGoldRadarEasing: EasingButton;
  readonly drillPower: number;
  readonly speed: number;
  shipState: ShipState;
  direction: Direction;
}

export enum MineSceneState {
  TUTORIAL,
  ROAMING,
  SHIP_BLEW_UP,
}

export interface MineSceneConfig {
  readonly gameState: GameState;
  readonly scene: Scene;
  readonly cursorKeys: CursorKeys;
  readonly zKey: Phaser.Input.Keyboard.Key;
  readonly qKey: Phaser.Input.Keyboard.Key;
  readonly shipConfig: MineShipConfig;
  readonly onDestroy: () => void;
  sceneState: MineSceneState;
  currentRoom: Room;
}

const ROOM_COUNT = { min: 5, max: 9 };
const BASE_ROOM_SPEC = {
  width: 20,
  height: 9,
};

const BASE_DRILL_RATE = 0.025;

const getBatteryDrainSpeed = (gs: GameState, scalar: number) =>
  0.00005 *
  scalar *
  Math.pow(
    0.75,
    shipStatTotal(gs, (x) => x.batteries),
  );

export const getInitialMineShipConfig = (
  gs: GameState,
  currentRoom: Room,
): MineShipConfig => ({
  position: getRandomEmptySpace(currentRoom),
  batteryEasing: new EasingButton({
    speed: getBatteryDrainSpeed(gs, 1),
    scale: 100,
    friction: 1,
    fn: linear,
    initialValue: 1,
    canGoNegative: false,
  }),
  foolsGoldRadarEasing: new EasingButton({
    speed: 0.001,
    scale: 1,
    friction: 1,
    fn: easeInQuint,
    initialValue: 0,
    canGoNegative: false,
  }),
  drillPower: shipStatTotal(gs, (x) => x.drills),
  shipState: ShipState.MOVING,
  speed: 0.7,
  direction: Direction.EAST,
});

export const getInitialMineSceneConfig = (
  scene: Scene,
  input: MineSceneInput,
  onDestroy: () => void,
): MineSceneConfig => {
  const rooms = generateRooms(
    Math.floor(
      Math.random() * (ROOM_COUNT.max - ROOM_COUNT.min) + ROOM_COUNT.min,
    ),
    {
      ...BASE_ROOM_SPEC,
      normalizedMoonDistance: input.normalizedMoonDistance,
    },
  );

  const currentRoom = choose(rooms);

  return {
    gameState: input.gameState,
    scene,
    cursorKeys: scene.input.keyboard.createCursorKeys(),
    zKey: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
    qKey: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
    sceneState: MineSceneState.ROAMING,
    shipConfig: getInitialMineShipConfig(input.gameState, currentRoom),
    onDestroy,
    currentRoom,
  };
};

export const updateMineSceneConfig = (
  time: number,
  dt: number,
  sc: MineSceneConfig,
): void => {
  switch (sc.sceneState) {
    case MineSceneState.TUTORIAL:
      sc.shipConfig.batteryEasing.setSpeed(0);
      break;
    case MineSceneState.ROAMING:
      updateShip(dt, sc);
      updateQKey(sc);
      break;
    case MineSceneState.SHIP_BLEW_UP:
      // Do nothing so far.
      break;
  }
};

export const shipCoords = (sc: MineSceneConfig): { x: number; y: number } => ({
  x: Math.floor(sc.shipConfig.position.x / TILE_SIZE.x),
  y: Math.floor(sc.shipConfig.position.y / TILE_SIZE.y),
});

/** Gets the Tile that the ship is on. */
export const shipTile = (sc: MineSceneConfig): Tile => {
  const { x, y } = shipCoords(sc);
  return sc.currentRoom.tiles[x][y];
};

const updateShip = (dt: number, sc: MineSceneConfig): void => {
  updateFoolsGoldRadar(dt, sc);
  updateBattery(dt, sc);
  updateShipMovement(dt, sc);
  updateShipMining(dt, sc);
};

const updateQKey = (sc: MineSceneConfig): void => {
  if (sc.qKey.isDown) {
    const input: LootSceneInput = {
      gameState: {
        ...sc.gameState,
        shipWallet: truncateCost(sc.gameState.shipWallet),
      },
      wasShipDestroyed: false,
    };
    sc.scene.scene.start(keys.scenes.loot, input);

    sc.onDestroy();
  }
};

const updateFoolsGoldRadar = (dt: number, sc: MineSceneConfig): void => {
  const radarStrength = shipStatTotal(sc.gameState, (x) => x.foolsGoldRadar);
  if (radarStrength === 0) {
    return;
  }

  if (sc.zKey.isDown) {
    sc.shipConfig.foolsGoldRadarEasing.update(dt, EasingDirection.INCREASE);
    sc.shipConfig.batteryEasing.setSpeed(
      getBatteryDrainSpeed(sc.gameState, 3 / radarStrength),
    );
  } else {
    sc.shipConfig.foolsGoldRadarEasing.update(dt, EasingDirection.DECREASE);
    sc.shipConfig.batteryEasing.resetSpeed();
  }
};

const updateBattery = (dt: number, sc: MineSceneConfig): void => {
  const battery = sc.shipConfig.batteryEasing;
  battery.update(dt, EasingDirection.DECREASE);

  if (battery.getValue() <= 0) {
    const input: LootSceneInput = {
      gameState: {
        ...sc.gameState,
        shipWallet: truncateCost(sc.gameState.shipWallet),
      },
      wasShipDestroyed: false,
    };
    sc.scene.scene.start(keys.scenes.loot, input);

    sc.onDestroy();
  }
};

const updateShipMovement = (dt: number, sc: MineSceneConfig): void => {
  if (sc.shipConfig.shipState === ShipState.MINING) {
    return;
  }

  const left = sc.cursorKeys.left?.isDown ?? false;
  const right = sc.cursorKeys.right?.isDown ?? false;
  const up = sc.cursorKeys.up?.isDown ?? false;
  const down = sc.cursorKeys.down?.isDown ?? false;

  let direction: Direction | undefined = undefined;
  if (left && !right) {
    direction = Direction.WEST;
  } else if (right && !left) {
    direction = Direction.EAST;
  } else if (up && !down) {
    direction = Direction.NORTH;
  } else if (down && !up) {
    direction = Direction.SOUTH;
  }

  if (direction === undefined) {
    return;
  }

  sc.shipConfig.direction = direction;

  const [vx, vy] = directionOffset(sc.shipConfig.direction);

  sc.shipConfig.position.x += dt * vx * sc.shipConfig.speed;
  sc.shipConfig.position.y += dt * vy * sc.shipConfig.speed;

  // See if ship collides with any walls
  const coords = shipCoords(sc);
  const tile = sc.currentRoom.tiles[coords.x][coords.y];

  if (!isWalkable(tile)) {
    sc.shipConfig.position.x -= dt * vx * sc.shipConfig.speed;
    sc.shipConfig.position.y -= dt * vy * sc.shipConfig.speed;
    return;
  }

  // See if the ship needs to move to a new room
  if (coords.x === 0) {
    sc.currentRoom = sc.currentRoom.exits.get(Direction.WEST) as Room;
    sc.shipConfig.position.x = (BASE_ROOM_SPEC.width - 1) * TILE_SIZE.x;
  }
  if (coords.x === BASE_ROOM_SPEC.width - 1) {
    sc.currentRoom = sc.currentRoom.exits.get(Direction.EAST) as Room;
    sc.shipConfig.position.x = TILE_SIZE.x;
  }
  if (coords.y === 0) {
    sc.currentRoom = sc.currentRoom.exits.get(Direction.NORTH) as Room;
    sc.shipConfig.position.y = (BASE_ROOM_SPEC.height - 1) * TILE_SIZE.y;
  }
  if (coords.y === BASE_ROOM_SPEC.height - 1) {
    sc.currentRoom = sc.currentRoom.exits.get(Direction.SOUTH) as Room;
    sc.shipConfig.position.y = TILE_SIZE.y;
  }
};

const updateShipMining = (dt: number, sc: MineSceneConfig): void => {
  sc.shipConfig.shipState = ShipState.MOVING;

  const space = sc.cursorKeys.space?.isDown ?? false;

  if (!space) {
    return;
  }

  const tile = shipTile(sc);

  // Fool's Gold will blow up the ship!
  if (tile.type === TileType.FOOLS_GOLD) {
    sc.sceneState = MineSceneState.SHIP_BLEW_UP;
    setTimeout(() => {
      const input: LootSceneInput = {
        // Blowing up the ship means we can't take resources back :(
        gameState: {
          ...sc.gameState,
          shipWallet: { ...COST_FREE },
        },
        wasShipDestroyed: true,
      };

      setTimeout(() => {
        sc.scene.scene.start(keys.scenes.loot, input);
        sc.onDestroy();
      }, 3_000);
    });
    return;
  }

  if (!isMineable(tile)) {
    return;
  }

  sc.shipConfig.shipState = ShipState.MINING;
  const resourceTaken = dt * (1 + sc.shipConfig.drillPower) * BASE_DRILL_RATE;
  tile.resourceLeft = Math.max(0, tile.resourceLeft - resourceTaken);

  const resourceKey = TileResource[tile.resource].toLowerCase();
  sc.gameState.shipWallet[resourceKey] += resourceTaken;
};
