import { Scene } from 'phaser';
import { GameState } from '../model/game/game_state';
import { keys } from '../util/keys';
import { CursorKeys } from '../util/phaser_types';

export class CrashScene extends Scene {
  private gameState: GameState;
  private cursorkeys: CursorKeys;
  private timeout: NodeJS.Timeout;

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
    }, 5000);

    this.sound.add(keys.sounds.crash).play();
  }

  update(): void {
    const spaceDown = this.cursorkeys.space?.isDown ?? false;
    if (spaceDown) {
      clearTimeout(this.timeout);
      this.scene.start(keys.scenes.shop, this.gameState);
    }
  }
}
