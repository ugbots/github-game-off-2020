import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Cost } from '../../model/game/cost';

@Component({
  selector: 'rat-item-cost',
  templateUrl: 'assets/templates/shop/item_cost.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCostComponent {
  @Input() cost: Cost;
  @Input() salePrice?: Cost;
}
