import { Scene } from 'phaser';
import {
  EasingButton,
  EasingDirection,
  easeInOut,
  recoil,
} from '../../math/easing';
import { clamp } from '../../math/math';
import { keys } from '../../util/keys';
import { CursorKeys, Vector2 } from '../../util/phaser_types';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { GameState } from '../game/game_state';

export enum SceneState {
  ROTATE_CANNON,
  LAUNCH_SHIP,
}

export interface CannonSceneConfig {
  readonly scene: Scene;
  readonly gameState: GameState;
  readonly cursorKeys: CursorKeys;
  readonly rotationEasing: EasingButton;
  readonly cannonFireEasing: EasingButton;
  readonly loadedFuelEasing: EasingButton;
  readonly starCount: number;
  loadedFuel: number;
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
): CannonSceneConfig => ({
  scene,
  gameState,
  cursorKeys: scene.input.keyboard.createCursorKeys(),
  planetPivot: DEFAULT_PLANET_PIVOT.clone(),
  cannonPivot: DEFAULT_CANNON_PIVOT.clone(),
  starCount: 100,
  loadedFuel: 0,
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
    friction: 0.93,
    scale: 1,
    canGoNegative: false,
  }),
  loadedFuelEasing: new EasingButton({
    fn: easeInOut,
    speed: 0.001,
    friction: 1,
    scale: 1,
    canGoNegative: false,
  }),
  rotation: 0,
});

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
  if (sc.cursorKeys.space.isDown) {
    sc.sceneState = SceneState.LAUNCH_SHIP;
    sc.gameState.useFuel(sc.loadedFuel);

    setTimeout(() => {
      sc.scene.scene.start(keys.scenes.flight, sc.gameState);
    }, 2_000);
  }
  return sc;
};

const updateRotationEasing = (
  config: CannonSceneConfig,
  dt: number,
): CannonSceneConfig => {
  const left = config.cursorKeys.left.isDown;
  const right = config.cursorKeys.right.isDown;

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
  const up = sc.cursorKeys.up.isDown;
  const down = sc.cursorKeys.down.isDown;

  let dir = EasingDirection.NONE;
  if (up && !down) {
    dir = EasingDirection.INCREASE;
  }
  if (!up && down) {
    dir = EasingDirection.DECREASE;
  }
  sc.loadedFuelEasing.update(dt, dir);

  const maxFuel = Math.min(100, sc.gameState.getFuel());
  sc.loadedFuel = clamp(
    0,
    Math.floor(maxFuel * sc.loadedFuelEasing.getValue()),
    maxFuel,
  );
  return sc;
};
