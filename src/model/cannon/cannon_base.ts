import { keys } from '../../util/keys';
import { CannonSceneConfig, SceneState } from './cannon_scene_config';

export class CannonBase {
  private sprite: Phaser.GameObjects.Sprite;

  create(scene: Phaser.Scene, sc: CannonSceneConfig): CannonBase {
    this.sprite = scene.add.sprite(
      sc.cannonPivot.x,
      sc.cannonPivot.y,
      keys.sprites.cannonBase,
    );
    return this;
  }

  update(time: number, dt: number, sc: CannonSceneConfig): CannonBase {
    this.sprite.setPosition(sc.cannonPivot.x, sc.cannonPivot.y);

    // Shake based on loaded fuel
    if (sc.sceneState === SceneState.ROTATE_CANNON) {
      const loadedFuel = sc.loadedFuelEasing.getValue();
      this.sprite.scale = 1 + 0.001 * Math.random() * loadedFuel;
      this.sprite.setRotation((0.5 - Math.random()) * 0.001 * loadedFuel);
    }
    return this;
  }
}
