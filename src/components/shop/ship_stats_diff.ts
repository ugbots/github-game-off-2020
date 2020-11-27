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
      this.generateNumberStatsRow('Drill', currentStats.drills, diff?.drills),
      this.generateNumberStatsRow(
        'Boosters',
        currentStats.boosters,
        diff?.boosters,
      ),
      this.generateNumberStatsRow(
        'Batteries',
        currentStats.batteries,
        diff?.batteries,
      ),
      this.generateNumberStatsRow(
        'Stabilizers',
        currentStats.stabilizers,
        diff?.stabilizers,
      ),
      this.generateNumberStatsRow(
        'Max cannon power',
        currentStats.maxCannonPower,
        diff?.maxCannonPower,
      ),
      this.generateBoolStatsRow(
        'Moon radar',
        currentStats.moonRadar,
        diff?.moonRadar,
      ),
      this.generateNumberStatsRow(
        "Fool's Gold radar",
        currentStats.foolsGoldRadar,
        diff?.foolsGoldRadar,
      ),
    ];
  }

  private generateNumberStatsRow(
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

  private generateBoolStatsRow(
    text: string,
    current: boolean,
    diff?: boolean,
  ): StatsRow {
    const equipping = current === false && diff === true;
    const dequipping = current === true && diff === false;

    const result = diff ?? current;

    const deltaText = equipping ? '(+true)' : dequipping ? '(-false)' : '';

    return {
      text: `${text}: ${result} ${deltaText}`,
      classes: equipping
        ? POSITIVE_CLASSES
        : dequipping
        ? NEGATIVE_CLASSES
        : NEUTRAL_CLASSES,
    };
  }
}
