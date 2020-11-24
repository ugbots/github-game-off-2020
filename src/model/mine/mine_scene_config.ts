import { Scene } from 'phaser';
import { GameState } from '../game/game_state';
import { MineSceneInput } from './mine_scene_input';
import { generateRooms, Room } from './room';
import { RoomSpec } from './room_spec';

export interface MineSceneConfig {
  readonly gameState: GameState;
  readonly scene: Scene;
  readonly rooms: readonly Room[];
  currentRoom: Room;
}

const ROOM_COUNT = { min: 3, max: 7 };
const ROOM_SPEC: RoomSpec = {
  width: 30,
  height: 20,
};

export const getInitialMineSceneConfig = (
  scene: Scene,
  input: MineSceneInput,
): MineSceneConfig => {
  const rooms = generateRooms(
    Math.floor(
      Math.random() * (ROOM_COUNT.max - ROOM_COUNT.min) + ROOM_COUNT.min,
    ),
    ROOM_SPEC,
  );
  return {
    gameState: input.gameState,
    scene,
    rooms,
    currentRoom: rooms[0],
  };
};
