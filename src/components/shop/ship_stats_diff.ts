import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { EMPTY_INVENTORY, Inventory } from '../../model/game/game_state';
import { getDiff, getShipStats } from '../../model/game/ship_stats';

const NEUTRAL_CLASSES: readonly string[] = ['text-gray-100'];

const POSITIVE_CLASSES: readonly string[] = ['text-green-500'];

const NEGATIVE_CLASSES: readonly string[] = ['text-red-500'];

interface StatsRow {
  readonly text: string;
  readonly classes: readonly string[];
}

@Component({
  selector: 'rat-ship-stats-diff',
  templateUrl: 'assets/templates/shop/ship_stats_diff.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipStatsDiffComponent implements OnChanges {
  @Input() prev: Inventory = EMPTY_INVENTORY;
  @Input() next?: Inventory;

  statsRows: readonly StatsRow[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['prev'] || changes['next']) {
      this.refreshUi();
    }
  }

  private refreshUi(): void {
    this.statsRows = this.generateStatsRows();
  }

  private generateStatsRows(): readonly StatsRow[] {
    const currentStats = getShipStats(this.prev);
    const diff = this.next ? getDiff(this.prev, this.next) : undefined;

    return [
      this.generateStatsRow('Drill', currentStats.drills, diff?.drills),
      this.generateStatsRow('Boosters', currentStats.boosters, diff?.boosters),
      this.generateStatsRow(
        'Batteries',
        currentStats.batteries,
        diff?.batteries,
      ),
      this.generateStatsRow(
        'Stabilizers',
        currentStats.stabilizers,
        diff?.stabilizers,
      ),
      this.generateStatsRow(
        'Max cannon power',
        currentStats.maxCannonPower,
        diff?.maxCannonPower,
      ),
    ];
  }

  private generateStatsRow(
    text: string,
    power: number,
    diffPower?: number,
  ): StatsRow {
    const up = diffPower !== undefined && diffPower > 0;
    const down = diffPower !== undefined && diffPower < 0;

    const deltaText = up ? `(+${diffPower})` : down ? `(${diffPower})` : '';
    const totalPower = power + (diffPower ?? 0);

    return {
      text: `${text}: ${totalPower} ${deltaText}`,
      classes: up
        ? POSITIVE_CLASSES
        : down
        ? NEGATIVE_CLASSES
        : NEUTRAL_CLASSES,
    };
  }
}
