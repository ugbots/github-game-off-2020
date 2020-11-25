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
        ground: 'dirt1',
        wall: 'wall',
        gold: 'gold',
      },
    },
  },
  sounds: {
    crash: 'Crash',
  },
  particles: {
    dirt: {
      atlas: 'DirtParticlesAtlas',
    },
    fire: {
      atlas: 'FireParticlesAtlas',
    },
  },
});
