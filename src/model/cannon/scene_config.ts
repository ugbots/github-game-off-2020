import { EasingButton, EasingDirection, easeInOut, recoil } from '../../math/easing';
import { CursorKeys, Vector2 } from '../../util/phaser_types';
import { SCREEN_DIMENSIONS } from '../../util/screen';

export enum SceneState {
  ROTATE_CANNON,
  LAUNCH_SHIP,
}

export interface SceneConfig {
  readonly cursorKeys: CursorKeys;
  readonly rotationEasing: EasingButton;
  readonly cannonFireEasing: EasingButton;
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

export const getInitialSceneConfig = () => ({
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
  }),
  cannonFireEasing: new EasingButton({
    fn: recoil,
    speed: 0.001,
    friction: 0.93,
    scale: 1,
  }),
  rotation: 0,
});

export const updateSceneConfig = (
  config: SceneConfig,
  dt: number,
): SceneConfig => {
  switch (config.sceneState) {
    case SceneState.ROTATE_CANNON: {
      updateRotationEasing(config, dt);
      updateCannonPivot(config, dt);
      updateSceneState(config, dt);
      break;
    }
    case SceneState.LAUNCH_SHIP: {
      config.cannonFireEasing.update(dt, EasingDirection.INCREASE);
      config.rotationEasing.update(dt, EasingDirection.NONE);
    }
  }
  return config;
};

const updateSceneState = (config: SceneConfig, dt: number): SceneConfig => {
  if (config.cursorKeys.space.isDown) {
    config.sceneState = SceneState.LAUNCH_SHIP;
  }
  return config;
};

const updateRotationEasing = (config: SceneConfig, dt: number): SceneConfig => {
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

const updateCannonPivot = (sc: SceneConfig, dt: number): SceneConfig => {
  sc.cannonPivot = DEFAULT_CANNON_PIVOT.clone();

  sc.cannonPivot.x += sc.rotationEasing.getValue() * 2000;

  sc.cannonPivot.y += sc.rotationEasing.getValue() * (Math.random() * 400);

  return sc;
};