import { keys } from '../../util/keys';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import {
  FlightSceneConfig,
  FlightSceneState,
  FLIGHT_SCENE_SHIP_SIZE,
} from './flight_scene_config';
import { FlightShipThruster } from './flight_ship_thruster';

export class Ship {
  private particleManager: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private sprite: Phaser.GameObjects.Sprite;
  private thrusters: {
    rotateRight: FlightShipThruster;
    rotateLeft: FlightShipThruster;
    forward: FlightShipThruster;
  };

  create(sc: FlightSceneConfig): Ship {
    this.particleManager = sc.scene.add.particles(keys.particles.fire.atlas);

    this.thrusters = {
      rotateRight: new FlightShipThruster().create(sc, this.particleManager),
      rotateLeft: new FlightShipThruster().create(sc, this.particleManager),
      forward: new FlightShipThruster().create(sc, this.particleManager),
    };

    this.sprite = sc.scene.add.sprite(0, 0, keys.sprites.drillShip);
    this.sprite.scale = 2;

    return this;
  }

  destroy(): void {
    this.sprite.destroy();
    this.particleManager.destroy();
  }

  update(time: number, dt: number, sc: FlightSceneConfig): void {
    this.sprite.rotation = sc.shipRotation;
    this.sprite.x = sc.shipPosition.x;
    this.sprite.y = sc.shipPosition.y;

    this.updateThrusters(sc);

    if (sc.sceneState === FlightSceneState.INTRO) {
      const x = sc.shipIntroEasing.getValue();
      this.sprite.y = sc.shipPosition.y * x + SCREEN_DIMENSIONS.y * (1 - x);
    }

    if (
      sc.sceneState === FlightSceneState.ASTEROID_COLLISION ||
      sc.sceneState === FlightSceneState.MOON_COLLISION
    ) {
      this.sprite.scale += 0.001 * dt;
    }
  }

  private updateThrusters(sc: FlightSceneConfig): void {
    const shipX = sc.shipPosition.x;
    const shipY = sc.shipPosition.y - FLIGHT_SCENE_SHIP_SIZE / 2;

    this.thrusters.forward.setEnabled(sc.shipThrusters.forward);
    this.thrusters.rotateLeft.setEnabled(sc.shipThrusters.rotateLeft);
    this.thrusters.rotateRight.setEnabled(sc.shipThrusters.rotateRight);

    if (sc.shipThrusters.forward) {
      const angle = sc.shipRotation + Math.PI / 2;
      this.thrusters.forward.setRotation(angle);
      const x = shipX + 30 * Math.cos(angle);
      const y = shipY + 30 * Math.sin(angle);
      this.thrusters.forward.setPosition(x, y);
    }

    if (sc.shipThrusters.rotateLeft) {
      const angle = sc.shipRotation + Math.PI;
      this.thrusters.rotateLeft.setRotation(angle);
      const x = shipX + 20 * Math.cos(angle);
      const y = shipY + 20 * Math.sin(angle);
      this.thrusters.rotateLeft.setPosition(x, y);
    }

    if (sc.shipThrusters.rotateRight) {
      const angle = sc.shipRotation;
      this.thrusters.rotateRight.setRotation(angle);
      const x = shipX + 20 * Math.cos(angle);
      const y = shipY + 20 * Math.sin(angle);
      this.thrusters.rotateRight.setPosition(x, y);
    }
  }
}
