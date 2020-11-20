import { Scene } from 'phaser';
import { GameState, shipStatTotal } from '../game/game_state';
import { CursorKeys } from '../../util/phaser_types';
import {
  easeOutElastic,
  EasingButton,
  EasingDirection,
  linear,
} from '../../math/easing';
import { FlightSceneInput } from './flight_scene_input';
import { keys } from '../../util/keys';

export enum FlightSceneState {
  INTRO,
  FLIGHT,
}

const GRAVITY = 0.0025;

export interface FlightSceneConfig {
  readonly gameState: GameState;
  readonly scene: Scene;
  readonly cursorKeys: CursorKeys;
  readonly shipRotationVelocityEasing: EasingButton;
  verticalVelocity: number;
  verticalPosition: number;
  shipRotationVelocity: number;
  sceneState: FlightSceneState;
  shipIntroEasing: EasingButton;
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
    canGoNegative: true,
  }),
  verticalVelocity: input.cannonVelocityPercent * 0.5,
  verticalPosition: 0,
  shipRotationVelocity: input.shipRotationVelocity,
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
      updateVertically(sc, dt);
      updateShipEasingIntro(sc, dt);
      break;
    }
    case FlightSceneState.FLIGHT: {
      updateVertically(sc, dt);
      updateShipRotation(sc, dt);
      break;
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
  sc.verticalVelocity -= GRAVITY * dt;
  sc.verticalPosition += sc.verticalVelocity;

  if (sc.verticalVelocity < 0 && sc.verticalPosition < 0) {
    sc.verticalVelocity = 0;
    sc.verticalPosition = 0;
    sc.scene.scene.start(keys.scenes.crash, sc.gameState);
  }

  return sc;
};

const updateShipRotation = (
  sc: FlightSceneConfig,
  dt: number,
): FlightSceneConfig => {
  const left = sc.cursorKeys.left.isDown;
  const right = sc.cursorKeys.right.isDown;

  let easingDir = EasingDirection.NONE;
  if (left && !right) {
    easingDir = EasingDirection.INCREASE;
  }
  if (!left && right) {
    easingDir = EasingDirection.DECREASE;
  }
  sc.shipRotationVelocityEasing.update(dt, easingDir);

  sc.shipRotationVelocity = sc.shipRotationVelocityEasing.getValue() * 0.01;

  return sc;
};
