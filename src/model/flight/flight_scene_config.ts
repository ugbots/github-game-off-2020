import { Scene } from 'phaser';
import { GameState, shipStatTotal } from '../game/game_state';
import { CursorKeys, Vector2 } from '../../util/phaser_types';
import {
  easeOutElastic,
  EasingButton,
  EasingDirection,
  linear,
} from '../../math/easing';
import { FlightSceneInput } from './flight_scene_input';
import { keys } from '../../util/keys';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { MineSceneInput } from '../mine/mine_scene_input';

export enum FlightSceneState {
  INTRO,
  FLIGHT,
  ASTEROID_COLLISION,
}

/** How fast the earth pulls on the ship */
const GRAVITY = 0.0025;

/** Used to respawn the asteroid when it gets too far away */
const MAX_ASTEROID_DISTANCE = SCREEN_DIMENSIONS.x;

/** How close we need to be to the asteroid for it to suck us in */
const ASTEROID_COLLISION_RADIUS = SCREEN_DIMENSIONS.x / 12;

/** Where the ship is after the intro state */
const SHIP_POSITION = new Vector2(
  SCREEN_DIMENSIONS.x / 2,
  SCREEN_DIMENSIONS.y - 100,
);

export interface FlightSceneConfig {
  readonly gameState: GameState;
  readonly scene: Scene;
  readonly cursorKeys: CursorKeys;
  readonly shipRotationVelocityEasing: EasingButton;
  readonly shipIntroEasing: EasingButton;
  readonly shipAcceleration: number;
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
): FlightSceneConfig => ({
  gameState: input.gameState,
  scene,
  cursorKeys: scene.input.keyboard.createCursorKeys(),
  shipRotationVelocityEasing: new EasingButton({
    fn: linear,
    speed: 0.001,
    scale: 1,
    friction: Math.max(
      0,
      1 - 0.1 * shipStatTotal(input.gameState, (x) => x.stabilizers),
    ),
    initialValue: input.shipRotationVelocity,
    canGoNegative: true,
  }),
  shipAcceleration: 0.01,
  asteroidPosition: new Vector2(Math.random() * SCREEN_DIMENSIONS.x, 0),
  verticalPosition: 0,
  shipVelocity: new Vector2(0, input.cannonVelocityPercent),
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
});

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

  if (sc.shipVelocity.y < 0 && sc.verticalPosition < 0) {
    sc.shipVelocity.x = 0;
    sc.shipVelocity.y = 0;
    sc.verticalPosition = 0;
    sc.scene.scene.start(keys.scenes.crash, sc.gameState);
  }

  return sc;
};

const updateShipRotation = (
  sc: FlightSceneConfig,
  dt: number,
): FlightSceneConfig => {
  const left = sc.cursorKeys.left?.isDown ?? false;
  const right = sc.cursorKeys.right?.isDown ?? false;

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
  let acc = 0;
  if (sc.cursorKeys.up?.isDown ?? false) {
    acc = sc.shipAcceleration;
  }

  sc.shipVelocity.x += dt * acc * -Math.sin(sc.shipRotation);
  sc.shipVelocity.y += dt * acc * Math.cos(sc.shipRotation);

  return sc;
};

const updateAsteroidPosition = (sc: FlightSceneConfig): FlightSceneConfig => {
  sc.asteroidPosition.x += sc.shipVelocity.x;
  sc.asteroidPosition.y += sc.shipVelocity.y;

  const asteroidDist = Phaser.Math.Distance.Between(
    SHIP_POSITION.x,
    SHIP_POSITION.y,
    sc.asteroidPosition.x,
    sc.asteroidPosition.y,
  );

  if (asteroidDist > MAX_ASTEROID_DISTANCE) {
    Phaser.Math.RandomXY(sc.asteroidPosition);
    sc.asteroidPosition.normalize().scale(MAX_ASTEROID_DISTANCE / 2);
    sc.asteroidPosition.x += SHIP_POSITION.x;
    sc.asteroidPosition.y += SHIP_POSITION.y;
  }

  if (asteroidDist < ASTEROID_COLLISION_RADIUS) {
    sc.sceneState = FlightSceneState.ASTEROID_COLLISION;
    setTimeout(() => {
      const input: MineSceneInput = {
        gameState: sc.gameState,
      };
      sc.scene.scene.start(keys.scenes.mine, input);
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
  sc.asteroidPosition.x = 0.99 * sc.asteroidPosition.x + 0.01 * SHIP_POSITION.x;
  sc.asteroidPosition.y = 0.99 * sc.asteroidPosition.y + 0.01 * SHIP_POSITION.y;

  return sc;
};
