import { Scene } from 'phaser';
import { getInitialSceneConfig, SceneConfig } from '../model/shop/scene_config';
import { GameState } from '../model/game/game_state';
import { SpriteButton } from '../ui/sprite_button';
import { SCREEN_DIMENSIONS } from '../util/screen';

export class ShopScene extends Scene {
  private sceneConfig: SceneConfig;

  private spriteButtons: SpriteButton[];

  constructor() {
    super({
      active: false,
      visible: false,
      key: 'Shop',
    });
  }

  /* override */
  init(gameState: GameState): void {
    this.sceneConfig = getInitialSceneConfig(this, gameState);
  }

  /* override */
  create(): void {
    const leftChevron = new SpriteButton().create(
      this.sceneConfig,
      'shop_chevron',
      8,
      8,
      () => {
        console.log('left chevron');
        this.updateUi();
      },
    );

    const rightChevron = new SpriteButton().create(
      this.sceneConfig,
      'shop_chevron',
      SCREEN_DIMENSIONS.x - 8,
      8,
      () => {
        console.log('right chevron');
        this.updateUi();
      },
      (sprite) => {
        sprite.flipX = true;
        return sprite;
      },
    );

    this.spriteButtons = [leftChevron, rightChevron];
  }

  private updateUi(): void {
    this.spriteButtons.forEach(s => {
      s.updateUi(this.sceneConfig);
    });
  }
}
