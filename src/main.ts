import * as Phaser from 'phaser';
import { ALL_SCENES } from './scenes/scenes';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Sample',

  type: Phaser.AUTO,

  scale: {
    width: 1280,
    height: 720,
  },

  scene: ALL_SCENES,

  render: {
    antialias: false,
    antialiasGL: false,
  },

  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },

  parent: 'game',
  backgroundColor: '#000000',
};

export const game = new Phaser.Game(gameConfig);

window.addEventListener('resize', () => {
  game.scale.refresh();
});
