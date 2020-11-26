import { Scene } from 'phaser';
import { GameState, shipStatTotal } from '../game/game_state';
import { CursorKeys, Vector2 } from '../../util/phaser_types';
import {
  easeInOut,
  easeOutElastic,
  EasingButton,
  EasingDirection,
  linear,
} from '../../math/easing';
import { FlightSceneInput } from './flight_scene_input';
import { keys } from '../../util/keys';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { MineSceneInput } from '../mine/mine_scene_input';
import { clamp } from '../../math/math';

export enum FlightSceneState {
  INTRO,
  FLIGHT,
  ASTEROID_COLLISION,
  MOON_COLLISION,
}

/** How fast the earth pulls on the ship */
const GRAVITY = 0.0025;

/** Used to respawn the asteroid when it gets too far away */
const MAX_ASTEROID_DISTANCE = SCREEN_DIMENSIONS.y * 1.5;

/** How close we need to be to the asteroid for it to suck us in */
const ASTEROID_COLLISION_RADIUS = SCREEN_DIMENSIONS.x / 12;

export const MOON_SIZE = SCREEN_DIMENSIONS.x / 2;
/**
 * When aimed at the moon, it shows up here. If the ship velocity changes, this
 * will need to change too.
 */
const MOON_HEIGHT = 12000;
export const INITIAL_MOON_POSITION = new Vector2(
  SCREEN_DIMENSIONS.x / 2,
  -MOON_HEIGHT,
);

/** Where the ship is after the intro state */
export const FLIGHT_SCENE_SHIP_POSITION = new Vector2(
  SCREEN_DIMENSIONS.x / 2,
  SCREEN_DIMENSIONS.y / 2,
);
export const FLIGHT_SCENE_SHIP_SIZE = 10;

export interface ShipThrusters {
  rotateRight: boolean;
  rotateLeft: boolean;
  forward: boolean;
}

export interface FlightSceneConfig {
  readonly gameState: GameState;
  readonly scene: Scene;
  readonly onDestroy: () => void;
  readonly cursorKeys: CursorKeys;
  readonly shipRotationVelocityEasing: EasingButton;
  readonly shipIntroEasing: EasingButton;
  readonly shipAcceleration: number;
  readonly maxShipXVelocity: number;
  readonly aimedAtMoon: boolean;
  readonly moonPosition: Vector2;
  shipThrusters: ShipThrusters;
  asteroidPosition: Vector2;
  verticalPosition: number;
  shipVelocity: Vector2;
  shipRotationVelocity: number;
  shipRotation: number;
  sceneState: FlightSceneState;
}

export const getInitialSceneConfig = (
  scene: Scene,
  input: FlightSceneInput,
  onDestroy: () => void,
): FlightSceneConfig => {
  const stabilizers = shipStatTotal(input.gameState, (x) => x.stabilizers);
  const boosters = shipStatTotal(input.gameState, (x) => x.boosters);
  return {
    gameState: input.gameState,
    scene,
    onDestroy,
    cursorKeys: scene.input.keyboard.createCursorKeys(),
    shipRotationVelocityEasing: new EasingButton({
      fn: linear,
      speed: 0.0005 * (1 + stabilizers),
      scale: 1,
      friction: Math.max(0, 1 - 0.1 * stabilizers),
      initialValue: 1,
      canGoNegative: true,
    }),
    shipAcceleration: 0.001 * (1 + boosters),
    maxShipXVelocity: 5 * (1 + boosters),
    aimedAtMoon: input.aimedAtMoon,
    moonPosition: INITIAL_MOON_POSITION.clone(),
    shipThrusters: {
      forward: false,
      rotateLeft: false,
      rotateRight: false,
    },
    asteroidPosition: new Vector2(Math.random() * SCREEN_DIMENSIONS.x, 0),
    verticalPosition: 0,
    // If you want to change the ship velocity, also make sure to change the
    // moon's position. Do this by starting the flight scene at 100 fuel, and
    // picking a number just below how high the ship will go.
    shipVelocity: new Vector2(0, Math.pow(input.cannonVelocityPercent, 0.75)),
    shipRotationVelocity: 0,
    shipRotation: 0,
    sceneState: FlightSceneState.INTRO,
    shipIntroEasing: new EasingButton({
      fn: easeOutElastic,
      speed: 0.0006,
      scale: 1,
      friction: 1,
      canGoNegative: false,
    }),
  };
};

export const updateSceneConfig = (
  time: number,
  dt: number,
  sc: FlightSceneConfig,
): FlightSceneConfig => {
  switch (sc.sceneState) {
    case FlightSceneState.INTRO: {
      updateShipRotation(sc, dt);
      updateVertically(sc, dt);
      updateShipEasingIntro(sc, dt);
      updateAsteroidPosition(sc);
      break;
    }
    case FlightSceneState.FLIGHT: {
      updateShipRotation(sc, dt);
      updateShipVelocity(sc, dt);
      updateVertically(sc, dt);
      updateAsteroidPosition(sc);
      break;
    }
    case FlightSceneState.ASTEROID_COLLISION: {
      updateShipFliesTowardAsteroid(sc, dt);
    }
    case FlightSceneState.MOON_COLLISION: {
      updateShipFliesTowardMoon(sc, dt);
    }
  }
  return sc;
};

const updateShipEasingIntro = (
  sc: FlightSceneConfig,
  dt: number,
): FlightSceneConfig => {
  sc.shipIntroEasing.update(dt, EasingDirection.INCREASE);

  if (sc.shipIntroEasing.getInternalValue() >= 1) {
    sc.shipRotationVelocityEasing.setValue(sc.shipRotationVelocity * 100);
    sc.sceneState = FlightSceneState.FLIGHT;
  }

  return sc;
};

const updateVertically = (
  sc: FlightSceneConfig,
  dt: number,
): FlightSceneConfig => {
  sc.shipVelocity.y -= GRAVITY * dt;
  sc.verticalPosition += sc.shipVelocity.y;
  sc.moonPosition.y += sc.shipVelocity.y;

  if (sc.shipVelocity.y < 0 && sc.verticalPosition < 0) {
    sc.shipVelocity.x = 0;
    sc.shipVelocity.y = 0;
    sc.verticalPosition = 0;
    sc.scene.scene.start(keys.scenes.crash, sc.gameState);

    setTimeout(() => {
      sc.onDestroy();
    }, 1);
  }

  if (sc.verticalPosition >= MOON_HEIGHT && sc.aimedAtMoon) {
    sc.sceneState = FlightSceneState.MOON_COLLISION;

    setTimeout(() => {
      sc.scene.scene.start(keys.scenes.mainMenu);
      setTimeout(() => {
        sc.onDestroy();
      }, 1);
    }, 2_000);
  }

  return sc;
};

const updateShipRotation = (
  sc: FlightSceneConfig,
  dt: number,
): FlightSceneConfig => {
  const left = sc.cursorKeys.left?.isDown ?? false;
  const right = sc.cursorKeys.right?.isDown ?? false;

  sc.shipThrusters.rotateLeft = right;
  sc.shipThrusters.rotateRight = left;

  let easingDir = EasingDirection.NONE;
  if (left && !right) {
    easingDir = EasingDirection.INCREASE;
  }
  if (!left && right) {
    easingDir = EasingDirection.DECREASE;
  }
  sc.shipRotationVelocityEasing.update(dt, easingDir);

  sc.shipRotationVelocity = sc.shipRotationVelocityEasing.getValue() * 0.01;

  sc.shipRotation -= dt * sc.shipRotationVelocity;

  return sc;
};

const updateShipVelocity = (
  sc: FlightSceneConfig,
  dt: number,
): FlightSceneConfig => {
  const up = sc.cursorKeys.up?.isDown ?? false;

  sc.shipThrusters.forward = up;

  let acc = 0;
  if (up) {
    acc = sc.shipAcceleration;
  }

  sc.shipVelocity.x += dt * acc * -Math.sin(sc.shipRotation);

  sc.shipVelocity.x = clamp(
    -sc.maxShipXVelocity,
    sc.shipVelocity.x,
    sc.maxShipXVelocity,
  );

  return sc;
};

const updateAsteroidPosition = (sc: FlightSceneConfig): FlightSceneConfig => {
  sc.asteroidPosition.x += sc.shipVelocity.x;
  sc.asteroidPosition.y += sc.shipVelocity.y;

  const asteroidDist = Phaser.Math.Distance.Between(
    FLIGHT_SCENE_SHIP_POSITION.x,
    FLIGHT_SCENE_SHIP_POSITION.y,
    sc.asteroidPosition.x,
    sc.asteroidPosition.y,
  );

  if (asteroidDist > MAX_ASTEROID_DISTANCE) {
    sc.asteroidPosition.x = Math.random() * SCREEN_DIMENSIONS.x;

    if (sc.shipVelocity.y > 0) {
      // Spawn the asteroid above us
      sc.asteroidPosition.y = -(MAX_ASTEROID_DISTANCE / 20);
    } else {
      // Spawn the asteroid underneath us
      sc.asteroidPosition.y = SCREEN_DIMENSIONS.y + MAX_ASTEROID_DISTANCE / 2;
    }
  }

  if (asteroidDist < ASTEROID_COLLISION_RADIUS) {
    sc.sceneState = FlightSceneState.ASTEROID_COLLISION;
    const normalizedMoonDistance = sc.verticalPosition / MOON_HEIGHT;
    setTimeout(() => {
      const input: MineSceneInput = {
        gameState: sc.gameState,
        normalizedMoonDistance,
      };
      sc.scene.scene.start(keys.scenes.mine, input);

      setTimeout(() => {
        sc.onDestroy();
      }, 1);
    }, 3_000);
  }

  return sc;
};

const updateShipFliesTowardAsteroid = (
  sc: FlightSceneConfig,
  dt: number,
): FlightSceneConfig => {
  sc.shipRotation += 0.01 * dt;
  sc.shipVelocity.x = 0;
  sc.shipVelocity.y = 0;
  sc.asteroidPosition.x =
    0.99 * sc.asteroidPosition.x + 0.01 * FLIGHT_SCENE_SHIP_POSITION.x;
  sc.asteroidPosition.y =
    0.99 * sc.asteroidPosition.y + 0.01 * FLIGHT_SCENE_SHIP_POSITION.y;

  return sc;
};

const updateShipFliesTowardMoon = (
  sc: FlightSceneConfig,
  dt: number,
): FlightSceneConfig => {
  sc.shipRotation += 0.01 * dt;
  sc.shipVelocity.x = 0;
  sc.shipVelocity.y = 0;
  sc.moonPosition.x =
    0.99 * sc.moonPosition.x + 0.01 * FLIGHT_SCENE_SHIP_POSITION.x;
  sc.moonPosition.y =
    0.99 * sc.moonPosition.y + 0.01 * FLIGHT_SCENE_SHIP_POSITION.y;

  return sc;
};
