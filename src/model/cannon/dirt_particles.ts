import { CannonSceneConfig } from './cannon_scene_config';
import { ParticleEmitter, Vector2 } from '../../util/phaser_types';

import * as Phaser from 'phaser';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { keys } from '../../util/keys';

export class DirtParticles {
  private manager: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  private position: Vector2;

  create(scene: Phaser.Scene, sc: CannonSceneConfig): DirtParticles {
    this.manager = scene.add.particles(keys.particles.dirt.atlas);

    this.position = new Vector2(
      sc.cannonPivot.x,
      sc.cannonPivot.y + SCREEN_DIMENSIONS.y / 20,
    );

    this.emitter = this.manager.createEmitter({
      frame: 'dirt',
      x: this.position.x,
      y: this.position.y,
      lifespan: 1000,
      speed: {
        min: 300,
        max: 400,
      },
      angle: 330,
      gravityY: 1800,
      scale: {
        start: 0.4,
        end: 0,
      },
      quantity: 0,
      blendMode: 'COPY',
    });

    return this;
  }

  destroy(): void {
    this.manager.destroy();
  }

  update(time: number, dt: number, sc: CannonSceneConfig): DirtParticles {
    const left = sc.cursorKeys.left?.isDown ?? false;
    const right = sc.cursorKeys.right?.isDown ?? false;

    if ((!left && !right) || (left && right)) {
      this.emitter.setQuantity(0);
      return this;
    }

    this.emitter.setPosition(
      this.position.x + (2 * Math.random() - 1) * (SCREEN_DIMENSIONS.x / 18),
      this.position.y,
    );

    const angle = 270 + (left ? 60 : -60);

    const speed = 200 + Math.abs(sc.rotationEasing.getValue()) * 25000;
    this.emitter.setSpeed(speed);

    this.emitter.setAngle(angle + 10 * (Math.random() - 0.5));
    this.emitter.setQuantity(1);

    return this;
  }
}
