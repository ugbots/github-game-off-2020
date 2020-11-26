import { keys } from '../../util/keys';
import { CannonSceneConfig } from './cannon_scene_config';

export class Planet {
  private background: Phaser.GameObjects.Sprite;
  private foreground: Phaser.GameObjects.Sprite;

  create(
    scene: Phaser.Scene,
    sc: CannonSceneConfig,
    createBetweenPlanets: () => void,
  ): Planet {
    this.background = scene.add.sprite(
      sc.planetPivot.x,
      sc.planetPivot.y,
      keys.sprites.planetBg,
    );

    this.background.scaleX = 16;
    this.background.scaleY = 16;

    createBetweenPlanets();

    this.foreground = scene.add.sprite(
      sc.planetPivot.x,
      sc.planetPivot.y,
      keys.sprites.planetFg,
    );

    this.foreground.scaleX = 16;
    this.foreground.scaleY = 16;

    return this;
  }

  destroy(): void {
    this.background.destroy();
    this.foreground.destroy();
  }

  update(time: number, dt: number, sc: CannonSceneConfig): Planet {
    this.background.rotation = sc.rotation;
    this.foreground.rotation = sc.rotation;
    return this;
  }
}
