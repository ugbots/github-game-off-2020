import * as Phaser from 'phaser';
import { Planet } from '../model/cannon/planet';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Cannon'
};

export class CannonScene extends Phaser.Scene {
    private planet: Planet;

    constructor() {
        super(sceneConfig);
    }

    /* override */
    create(): void {
        this.planet = new Planet().create(this);
    }

    /* override */
    update(time: number, dt: number): void {
        this.planet.update(time, dt);
    }
}