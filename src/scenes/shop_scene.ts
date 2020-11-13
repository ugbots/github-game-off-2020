import { Scene } from 'phaser';
import { GameState } from '../model/game/game_state';
import { showShop } from '../services/shop/shop_service';
import { keys } from '../util/keys';

let subFn: (g: GameState) => void = undefined;

export const finishShopping = (g: GameState): void => {
  subFn(g);
};

export class ShopScene extends Scene {
  constructor() {
    super({
      active: false,
      visible: false,
      key: keys.scenes.shop,
    });
  }

  /* override */
  init(gameState: GameState): void {
    showShop(gameState);

    subFn = (doneGameState: GameState) => {
      this.scene.start(keys.scenes.cannon, doneGameState);
    };
  }
}
