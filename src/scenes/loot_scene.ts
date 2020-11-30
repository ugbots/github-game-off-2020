import { Scene } from 'phaser';
import { moveShipWalletToWallet } from '../model/game/game_state';
import { LootSceneInput } from '../model/loot/loot_scene_input';
import { keys } from '../util/keys';
import { CursorKeys } from '../util/phaser_types';
import { titleCase } from '../util/strings';

export class LootScene extends Scene {
  private lootSceneInput: LootSceneInput;
  private timeout: number;
  private cursorKeys: CursorKeys;

  private lootText: Phaser.GameObjects.Text;

  constructor() {
    super({
      active: false,
      visible: false,
      key: keys.scenes.loot,
    });
  }

  /* override */
  init(input: LootSceneInput): void {
    this.lootSceneInput = input;
  }

  /* override */
  create(): void {
    this.lootText = this.add.text(100, 100, this.generateText(), {
      fontFamily: 'monospace',
      color: 'white',
    });

    this.cursorKeys = this.input.keyboard.createCursorKeys();

    this.timeout = setTimeout(() => {
      this.advanceScene();
    }, 5000);
  }

  destroy(): void {
    this.lootText.destroy();
  }

  update(): void {
    const space = this.cursorKeys.space?.isDown ?? false;
    if (space) {
      clearTimeout(this.timeout);
      this.advanceScene();
    }
  }

  private advanceScene(): void {
    const newGameState = moveShipWalletToWallet(this.lootSceneInput.gameState);

    if (this.lootSceneInput.gameState.earthInventory.fuel <= 0) {
      this.scene.start(keys.scenes.failure, newGameState);
    } else {
      this.scene.start(keys.scenes.shop, newGameState);
    }

    setTimeout(() => {
      this.destroy();
    });
  }

  private generateText(): string {
    if (this.lootSceneInput.wasShipDestroyed) {
      return 'Your ship was destroyed, so you didn\'t earn any resources.';
    }

    const wallet = this.lootSceneInput.gameState.shipWallet;
    const loot = Object.keys(wallet)
      .map((k) => `    ${titleCase(k)}: ${wallet[k]}`)
      .join('\n');

    return 'You earned:\n' + loot;
  }
}
