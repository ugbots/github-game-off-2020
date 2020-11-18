import { Scene } from 'phaser';
import { GameState } from '../game/game_state';
import { CursorKeys } from '../../util/phaser_types';
import {
  easeOutElastic,
  EasingButton,
  EasingDirection,
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
    case FlightSceneState.INTRO:
      {
        updateShipEasingIntro(sc, dt);
      }
      break;
  }
  return sc;
};

export const updateShipEasingIntro = (
  sc: FlightSceneConfig,
  dt: number,
): FlightSceneConfig => {
  sc.shipIntroEasing.update(dt, EasingDirection.INCREASE);

  if (sc.shipIntroEasing.getInternalValue() >= 1) {
    sc.sceneState = FlightSceneState.FLIGHT;
  }

  return sc;
};
