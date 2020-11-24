export const keys = Object.freeze({
  scenes: {
    cannon: 'CannonScene',
    crash: 'CrashScene',
    flight: 'FlightScene',
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
        dirt1: 'dirt1',
        dirt2: 'dirt2',
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
