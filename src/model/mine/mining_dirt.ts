import { ThrowStmt } from '@angular/compiler';
import { keys } from '../../util/keys';
import { CannonSceneConfig } from '../cannon/cannon_scene_config';
import { MineSceneConfig, ShipState } from './mine_scene_config';

export class MiningDirt {
  private manager: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  create(sc: MineSceneConfig): MiningDirt {
    this.manager = sc.scene.add.particles(keys.particles.dirt.atlas);
    this.emitter = this.manager.createEmitter({
      frame: keys.particles.dirt.frames,
      x: sc.shipConfig.position.x,
      y: sc.shipConfig.position.y,
      lifespan: 300,
      speed: {
        min: 200,
        max: 1000,
      },
      angle: {
        min: 0,
        max: 360,
      },
      rotate: {
        min: 0,
        max: 90,
      },
      gravityY: 0,
      scale: {
        start: 0.05,
        end: 0.2,
      },
      quantity: 0,
      blendMode: 'ADD',
    });
    return this;
  }

  destroy(): void {
    this.manager.destroy();
  }

  update(sc: MineSceneConfig): void {
    if (sc.shipConfig.shipState === ShipState.MINING) {
      this.emitter.setPosition(
        sc.shipConfig.position.x,
        sc.shipConfig.position.y,
      );
      this.emitter.setQuantity(1);
    } else {
      this.emitter.setQuantity(0);
    }
  }
}
