import { failure, Result, success } from '../../types/either';
import { Unit, UNIT } from '../../types/unit';

export interface Inventory {
  readonly fuel: number;
}

const INITIAL_EARTH_INVENTORY: Inventory = {
  fuel: 100,
};

/** State that needs to be passed between scenes. */
export class GameState {
  private readonly earthInventory = INITIAL_EARTH_INVENTORY;

  hasFuel(fuel: number): boolean {
    return fuel <= this.earthInventory.fuel;
  }

  useFuel(fuel: number): Result<string, Unit> {
    if (!this.hasFuel(fuel)) {
      return failure(
        `Can't use fuel! ${this.earthInventory.fuel} available, ${fuel} requested.`,
      );
    }

    return success(UNIT);
  }
}
