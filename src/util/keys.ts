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
        unknown: 'unknown',
        ground: 'dirt1',
        wall: 'wall',
        wall_ul_ground: 'wall_ul_ground',
        wall_u_ground: 'wall_u_ground',
        wall_ur_ground: 'wall_ur_ground',
        wall_l_ground: 'wall_l_ground',
        wall_r_ground: 'wall_r_ground',
        wall_dl_ground: 'wall_dl_ground',
        wall_d_ground: 'wall_d_ground',
        wall_dr_ground: 'wall_dr_ground',
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
