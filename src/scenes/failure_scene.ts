import { Scene } from 'phaser';
import { GameState } from '../model/game/game_state';
import { keys } from '../util/keys';
import { CursorKeys } from '../util/phaser_types';

export class FailureScene extends Scene {
  private gameState: GameState;
  private timeout: number;
  private cursorKeys: CursorKeys;

  private text: Phaser.GameObjects.Text;

  constructor() {
    super({
      active: false,
      visible: false,
      key: keys.scenes.failure,
    });
  }

  /* override */
  init(gameState: GameState): void {
    this.gameState = gameState;
  }

  /* override */
  create(): void {
    this.text = this.add.text(100, 100, this.generateText(), {
      fontFamily: 'monospace',
      color: 'white',
    });

    this.cursorKeys = this.input.keyboard.createCursorKeys();

    this.timeout = setTimeout(() => {
      this.advanceScene();
    }, 5000);
  }

  destroy(): void {
    this.text.destroy();
  }

  update(): void {
    const space = this.cursorKeys.space?.isDown ?? false;
    if (space) {
      clearTimeout(this.timeout);
      this.advanceScene();
    }
  }

  private advanceScene(): void {
    this.scene.start(keys.scenes.mainMenu);

    setTimeout(() => {
      this.destroy();
    });
  }

  private generateText(): string {
    return (
      "You don't have enough fuel to reach the moon!\n" +
      'You will forever be known as a rat failure.'
    );
  }
}
