import {
  FlightSceneConfig,
  FLIGHT_SCENE_SHIP_POSITION,
} from './flight_scene_config';

export const ROTATION_SPREAD_DEGREES = 30;

export class FlightShipThruster {
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  create(
    sc: FlightSceneConfig,
    manager: Phaser.GameObjects.Particles.ParticleEmitterManager,
  ): FlightShipThruster {
    this.emitter = manager.createEmitter({
      frame: ['fire_1', 'fire_2', 'fire_3', 'fire_4', 'fire_5'],
      x: FLIGHT_SCENE_SHIP_POSITION.x,
      y: FLIGHT_SCENE_SHIP_POSITION.y,
      lifespan: 200,
      speed: {
        min: 300,
        max: 800,
      },
      angle: {
        min: -ROTATION_SPREAD_DEGREES / 2,
        max: ROTATION_SPREAD_DEGREES / 2,
      },
      rotate: {
        min: 0,
        max: 90,
      },
      scale: {
        min: 2,
        max: 10,
      },
      quantity: 0,
      blendMode: 'ADD',
    });

    return this;
  }

  setPosition(x: number, y: number): void {
    this.emitter.setPosition(x, y);
  }

  setRotation(radians: number): void {
    const degrees = 360 * (radians / (Math.PI * 2));
    this.emitter.setAngle({
      min: degrees - ROTATION_SPREAD_DEGREES / 2,
      max: degrees + ROTATION_SPREAD_DEGREES / 2,
    });
  }

  setEnabled(enabled: boolean): void {
    this.emitter.setQuantity(enabled ? 5 : 0);
  }
}
