import { Scene } from 'phaser';
import {
  EasingButton,
  EasingDirection,
  easeInOut,
  recoil,
} from '../../math/easing';
import { mod } from '../../math/math';
import { keys } from '../../util/keys';
import { CursorKeys, Vector2 } from '../../util/phaser_types';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { FlightSceneInput } from '../flight/flight_scene_input';
import { GameState, shipStatTotal } from '../game/game_state';

export enum SceneState {
  TUTORIAL,
  ROTATE_CANNON,
  LAUNCH_SHIP,
}

export interface CannonSceneConfig {
  readonly scene: Scene;
  readonly cursorKeys: CursorKeys;
  readonly onDestroy: () => void;
  readonly rotationEasing: EasingButton;
  readonly cannonFireEasing: EasingButton;
  readonly loadedFuelEasing: EasingButton;
  readonly starCount: number;
  /** The location of the moon, in radians. This is uniformly distributed at
   * first, and is passed to the FlightScene. */
  readonly moonAngleRadians: number;
  gameState: GameState;
  sceneState: SceneState;
  planetPivot: Vector2;
  cannonPivot: Vector2;
  rotation: number;
}

const DEFAULT_PLANET_PIVOT = SCREEN_DIMENSIONS.clone().multiply(
  new Vector2(0.5, 2.0),
);
const DEFAULT_CANNON_PIVOT = SCREEN_DIMENSIONS.clone().multiply(
  new Vector2(0.5, 0.55),
);

export const getInitialSceneConfig = (
  scene: Scene,
  gameState: GameState,
  onDestroy: () => void,
): CannonSceneConfig => {
  const maxFuel = Math.min(
    gameState.earthInventory.fuel,
    shipStatTotal(gameState, (x) => x.maxCannonPower),
  );
  return {
    scene,
    gameState,
    onDestroy,
    cursorKeys: scene.input.keyboard.createCursorKeys(),
    planetPivot: DEFAULT_PLANET_PIVOT.clone(),
    cannonPivot: DEFAULT_CANNON_PIVOT.clone(),
    starCount: 100,
    moonAngleRadians: Math.random() * Math.PI * 2,
    sceneState: SceneState.ROTATE_CANNON,
    rotationEasing: new EasingButton({
      fn: easeInOut,
      speed: 0.002,
      friction: 0.93,
      scale: 0.02,
      canGoNegative: true,
    }),
    cannonFireEasing: new EasingButton({
      fn: recoil,
      speed: 0.001,
      friction: 1,
      scale: 1,
      canGoNegative: false,
    }),
    loadedFuelEasing: new EasingButton({
      fn: easeInOut,
      speed: 0.001,
      friction: 1,
      initialValue: 1,
      scale: maxFuel,
      canGoNegative: false,
    }),
    rotation: 0,
  };
};

export const isAimedAtMoon = (sc: CannonSceneConfig): boolean => {
  const angleDiff = mod(sc.rotation - sc.moonAngleRadians, Math.PI * 2);
  return angleDiff < 0.1 || angleDiff > Math.PI * 2 - 0.1;
};

export const updateSceneConfig = (
  time: number,
  dt: number,
  config: CannonSceneConfig,
): CannonSceneConfig => {
  switch (config.sceneState) {
    case SceneState.ROTATE_CANNON: {
      updateRotationEasing(config, dt);
      updateCannonPivot(config);
      updateSceneState(config);
      updateLoadedFuel(config, dt);
      break;
    }
    case SceneState.LAUNCH_SHIP: {
      config.cannonFireEasing.update(dt, EasingDirection.INCREASE);
      config.rotationEasing.update(dt, EasingDirection.NONE);
    }
  }
  return config;
};

const updateSceneState = (sc: CannonSceneConfig): CannonSceneConfig => {
  if (sc.cursorKeys.space?.isDown ?? false) {
    sc.sceneState = SceneState.LAUNCH_SHIP;

    const fuelToUse = sc.loadedFuelEasing.getValue();
    const fuelAvailable = sc.gameState.earthInventory.fuel;
    if (fuelToUse > fuelAvailable) {
      throw new Error(
        `Can't use ${fuelToUse} fuel! ${fuelAvailable} available.`,
      );
    }

    sc.gameState = {
      ...sc.gameState,
      earthInventory: {
        ...sc.gameState.earthInventory,
        fuel: fuelAvailable - fuelToUse,
      },
    };

    setTimeout(() => {
      const input: FlightSceneInput = {
        gameState: sc.gameState,
        cannonVelocityPercent: fuelToUse,
        aimedAtMoon: isAimedAtMoon(sc),
      };
      sc.scene.scene.start(keys.scenes.flight, input);
      sc.onDestroy();
    }, 2_000);
  }
  return sc;
};

const updateRotationEasing = (
  config: CannonSceneConfig,
  dt: number,
): CannonSceneConfig => {
  const left = config.cursorKeys.left?.isDown ?? false;
  const right = config.cursorKeys.right?.isDown ?? false;

  let dir = EasingDirection.NONE;
  if (left && !right) {
    dir = EasingDirection.INCREASE;
  }
  if (!left && right) {
    dir = EasingDirection.DECREASE;
  }

  config.rotationEasing.update(dt, dir);
  config.rotation += config.rotationEasing.getValue();

  return config;
};

const updateCannonPivot = (sc: CannonSceneConfig): CannonSceneConfig => {
  sc.cannonPivot = DEFAULT_CANNON_PIVOT.clone();

  sc.cannonPivot.x += sc.rotationEasing.getValue() * 2000;

  sc.cannonPivot.y += sc.rotationEasing.getValue() * (Math.random() * 400);

  return sc;
};

const updateLoadedFuel = (
  sc: CannonSceneConfig,
  dt: number,
): CannonSceneConfig => {
  const up = sc.cursorKeys.up?.isDown ?? false;
  const down = sc.cursorKeys.down?.isDown ?? false;

  if (up && !down) {
    sc.loadedFuelEasing.update(dt, EasingDirection.INCREASE);
  }
  if (!up && down) {
    sc.loadedFuelEasing.update(dt, EasingDirection.DECREASE);
  }

  return sc;
};
