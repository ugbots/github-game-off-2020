import { Scene } from 'phaser';
import { GameState } from '../model/game/game_state';
import { showShop } from '../services/shop/shop_service';
import { keys } from '../util/keys';
import { localStorage } from '../util/local_storage';

let subFn: (g: GameState) => void = () => {
  throw new Error('subFn not set!');
};

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
  init(gs: GameState): void {
    const gameState = {
      ...gs,
      currentScene: keys.scenes.shop,
    };
    localStorage.setGameState(gameState);

    showShop(gameState);

    subFn = (doneGameState: GameState) => {
      this.scene.start(keys.scenes.cannon, doneGameState);
    };
  }
}
