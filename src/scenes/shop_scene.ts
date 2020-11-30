import { Scene } from 'phaser';
import { GameState } from '../model/game/game_state';
import { showShop } from '../services/shop/shop_service';
import { keys } from '../util/keys';
import { localStorage } from '../util/local_storage';

let subFn: (g: GameState) => void = () => {
  throw new Error('subFn not set!');
};

let soundSubFn: (key: string) => void = () => {
  throw new Error('soundSubFn not set!');
};

export const shopScenePlaySound = (key: string): void => {
  soundSubFn(key);
};

export const finishShopping = (g: GameState): void => {
  subFn(g);
};

export class ShopScene extends Scene {
  private soundsByKey = new Map<string, Phaser.Sound.BaseSound>();

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

    [keys.sounds.powerUp, keys.sounds.cashRegister].forEach((key) => {
      this.soundsByKey.set(key, this.sound.add(key));
    });

    showShop(gameState);

    subFn = (doneGameState: GameState) => {
      this.scene.start(keys.scenes.cannon, doneGameState);

      setTimeout(() => {
        this.destroy();
      }, 10);
    };

    soundSubFn = (key: string) => {
      this.soundsByKey.get(key)?.play();
    };
  }

  destroy(): void {
    this.soundsByKey.forEach((sound) => {
      sound.destroy();
    });
  }
}
