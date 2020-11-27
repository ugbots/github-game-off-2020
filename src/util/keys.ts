export const keys = Object.freeze({
  scenes: {
    cannon: 'CannonScene',
    crash: 'CrashScene',
    flight: 'FlightScene',
    loot: 'LootScene',
    mainMenu: 'MainMenuScene',
    mine: 'MineScene',
    shop: 'ShopScene',
  },
  sprites: {
    cannonBase: 'CannonBaseSprite',
    cannonTurret: 'CannonTurretSprite',
    drillShip: 'DrillShipSprite',
    planetBg: 'PlanetBackgroundSprite',
    white: 'WhiteSprite',
    planetFg: 'PlanetForegroundSprite',
  },
  atlas: {
    asteroidTiles: {
      key: 'AsteroidTilesAtlas',
      textures: {
        unknown: 'unknown',
        transparent: 'transparent',
        ground: 'dirt1',
        wall: 'wall',
        gold: 'gold',
        emerald: 'emerald',
        ruby: 'ruby',
        sapphire: 'sapphire',
      },
    },
  },
  sounds: {
    crash: 'Crash',
  },
  particles: {
    dirt: {
      atlas: 'DirtParticlesAtlas',
      frames: ['dirt'],
    },
    fire: {
      atlas: 'FireParticlesAtlas',
      frames: ['fire_1', 'fire_2', 'fire_3', 'fire_4', 'fire_5'],
    },
  },
});
