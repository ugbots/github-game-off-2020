import './tailwind_main.css';

import 'zone.js';
import * as Phaser from 'phaser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MainModule } from './components/main/main_module';
import { ALL_SCENES } from './scenes/scenes';

const start = async () => {
  await platformBrowserDynamic().bootstrapModule(MainModule);

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

    audio: {
      disableWebAudio: true,
    },

    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },

    parent: 'phaser-root',
    backgroundColor: '#000000',
  };

  const game = new Phaser.Game(gameConfig);
};

start();
