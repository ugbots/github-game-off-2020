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
    blownUpDrillship: 'BlownUpDrillshipSprite',
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
        foolsGold: 'fools_gold',
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
    smoke: {
      atlas: 'SmokeParticlesAtlas',
      frames: ['smoke_1', 'smoke_2', 'smoke_3', 'smoke_4', 'smoke_5'],
    },
  },
});
