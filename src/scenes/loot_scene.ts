import { Scene } from 'phaser';
import { moveShipWalletToWallet } from '../model/game/game_state';
import { LootSceneInput } from '../model/loot/loot_scene_input';
import { keys } from '../util/keys';
import { titleCase } from '../util/strings';

export class LootScene extends Scene {
  private lootSceneInput: LootSceneInput;

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

    setTimeout(() => {
      const newGameState = moveShipWalletToWallet(
        this.lootSceneInput.gameState,
      );

      this.scene.start(keys.scenes.shop, newGameState);

      this.destroy();
    }, 5000);
  }

  destroy(): void {
    this.lootText.destroy();
  }

  private generateText(): string {
    const wallet = this.lootSceneInput.gameState.shipWallet;
    const loot = Object.keys(wallet)
      .map((k) => `    ${titleCase(k)}: ${wallet[k]}`)
      .join('\n');

    return 'You earned:\n' + loot;
  }
}
