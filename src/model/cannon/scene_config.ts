import { EasingButton, EasingDirection, easeInOut } from '../../math/easing';
import { CursorKeys, Vector2 } from '../../util/phaser_types';
import { SCREEN_DIMENSIONS } from '../../util/screen';

export interface SceneConfig {
  readonly cursorKeys: CursorKeys;
  readonly rotationEasing: EasingButton;
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

export const DEFAULT_SCENE_CONFIG = {
  planetPivot: DEFAULT_PLANET_PIVOT.clone(),
  cannonPivot: DEFAULT_CANNON_PIVOT.clone(),
  rotationEasing: new EasingButton({
    fn: easeInOut,
    speed: 0.002,
    friction: 0.93,
    scale: 0.02,
  }),
  rotation: 0,
};

export const updateSceneConfig = (
  config: SceneConfig,
  dt: number,
): SceneConfig => {
  updateRotationEasing(config, dt);
  updateCannonPivot(config, dt);
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
