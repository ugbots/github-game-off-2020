import { Scene } from 'phaser';
import { GameState } from '../model/game/game_state';
import { keys } from '../util/keys';
import { CursorKeys } from '../util/phaser_types';

export class CrashScene extends Scene {
  private gameState: GameState;
  private cursorkeys: CursorKeys;
  private timeout: number;

  private crashSound: Phaser.Sound.BaseSound;

  constructor() {
    super({
      active: false,
      visible: false,
      key: keys.scenes.crash,
    });
  }

  create(gameState: GameState): void {
    this.gameState = gameState;
    this.cursorkeys = this.scene.scene.input.keyboard.createCursorKeys();
    this.timeout = setTimeout(() => {
      this.scene.start(keys.scenes.shop, gameState);
      setTimeout(() => {
        this.destroy();
      }, 1);
    }, 5_000);

    this.crashSound = this.sound.add(keys.sounds.crash);
    this.crashSound.play();
  }

  destroy(): void {
    this.crashSound.destroy();
  }

  update(): void {
    const spaceDown = this.cursorkeys.space?.isDown ?? false;
    if (spaceDown) {
      clearTimeout(this.timeout);
      this.scene.start(keys.scenes.shop, this.gameState);
    }
  }
}
