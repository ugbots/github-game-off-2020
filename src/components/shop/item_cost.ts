import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Cost, isFree } from '../../model/game/cost';
import { titleCase } from '../../util/strings';

@Component({
  selector: 'rat-item-cost',
  templateUrl: 'assets/templates/shop/item_cost.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCostComponent implements OnChanges {
  @Input() cost?: Cost;
  @Input() salePrice?: Cost;
  @Input() isWallet: boolean;

  costKeys: readonly string[] = [];
  isFree = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cost']) {
      this.costKeys = Object.keys(this.cost);
      this.isFree = this.generateIsFree();
    }
  }

  iconSrc(key: string): string|undefined {
    const saleKey = this.salePrice ?? {}[key];
    if (this.cost[key] > 0 || (saleKey ?? 0) > 0) {
      return `assets/sprites/${key}.png`;
    }
    return undefined;
  }

  tooltip(key: string): string {
    return `${this.titleCase(key)} you get for selling this item.`;
  }

  titleCase(s: string): string {
    return titleCase(s);
  }

  private generateIsFree(): boolean {
    const isSalePriceFree =
      this.salePrice === undefined || isFree(this.salePrice);
    return isFree(this.cost) && isSalePriceFree;
  }
}
