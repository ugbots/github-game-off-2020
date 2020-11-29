import { Scene } from 'phaser';
import { GameState } from '../model/game/game_state';
import { keys } from '../util/keys';
import { CursorKeys } from '../util/phaser_types';

export class MoonScene extends Scene {
  private gameState: GameState;

  private text: Phaser.GameObjects.Text;
  private cursorKeys: CursorKeys;
  private timeout: number;

  constructor() {
    super({
      active: false,
      visible: false,
      key: keys.scenes.moon,
    });
  }

  /* override */
  init(gs: GameState): void {
    this.gameState = gs;
  }

  /* override */
  create(): void {
    const text =
      'You made it to the moon. Congratulations!\n' +
      `You still had ${this.gameState.earthInventory.fuel} fuel remaining.\n` +
      this.getRatingText();

    this.text = this.add.text(100, 100, text);
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    this.timeout = setTimeout(() => {
      this.advanceScene();
    }, 10_000);
  }

  destroy(): void {
    this.text.destroy();
  }

  /* override */
  update(): void {
    if (this.cursorKeys.space?.isDown ?? false) {
      clearTimeout(this.timeout);
      this.advanceScene();
    }
  }

  private advanceScene = () => {
    this.scene.start(keys.scenes.mainMenu);

    setTimeout(() => {
      this.destroy();
    });
  };

  private getRatingText(): string {
    const fuelLeft = this.gameState.earthInventory.fuel;

    if (fuelLeft < 100) {
      return 'You barely made it!';
    }
    if (fuelLeft < 500) {
      return 'Not too shabby!';
    }

    return "You're good at this!";
  }
}
