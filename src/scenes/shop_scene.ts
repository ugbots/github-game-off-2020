import { Scene } from 'phaser';
import { getInitialSceneConfig, SceneConfig } from '../model/shop/scene_config';
import { GameState } from '../model/game/game_state';
import { SpriteButton } from '../ui/sprite_button';
import { SCREEN_DIMENSIONS } from '../util/screen';
import { showShop } from '../services/shop/shop_service';

let subFn: (g: GameState) => void = undefined;

export const finishShopping = (g: GameState): void => {
  subFn(g);
};

export class ShopScene extends Scene {
  private sceneConfig: SceneConfig;

  private spriteButtons: SpriteButton[];

  constructor() {
    super({
      active: false,
      visible: false,
      key: 'Shop',
    });
  }

  /* override */
  init(gameState: GameState): void {
    showShop(gameState);

    subFn = (doneGameState: GameState) => {
      this.scene.start('Cannon', doneGameState);
    };
  }
}
