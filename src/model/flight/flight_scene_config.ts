import { Scene } from 'phaser';
import { GameState } from '../game/game_state';
import { CursorKeys } from '../../util/phaser_types';
import {
  easeInOut,
  easeOutElastic,
  EasingButton,
  EasingDirection,
  linear,
} from '../../math/easing';
import { FlightSceneInput } from './flight_scene_input';

export enum FlightSceneState {
  INTRO,
  FLIGHT,
}

export interface FlightSceneConfig {
  readonly gameState: GameState;
  readonly scene: Scene;
  readonly cursorKeys: CursorKeys;
  readonly shipRotationVelocityEasing: EasingButton;
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
    friction: 0.995,
    canGoNegative: true,
  }),
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
      updateShipEasingIntro(sc, dt);
      break;
    }
    case FlightSceneState.FLIGHT: {
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
