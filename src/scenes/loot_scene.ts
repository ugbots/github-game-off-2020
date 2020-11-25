import { Scene } from 'phaser';
import { keys } from '../util/keys';

export class LootScene extends Scene {
  constructor() {
    super({
      active: false,
      visible: false,
      key: keys.scenes.loot,
    });
  }

  /* override */
  init(): void {

  }
}
