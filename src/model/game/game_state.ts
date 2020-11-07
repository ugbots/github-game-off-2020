export interface GameState {
  readonly inventory: Inventory;

}

export interface Inventory {
  fuel: number;
}

export const getInitialGameState = (): GameState => ({
  inventory: {
    fuel: 100,
  },
});