import {Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges} from '@angular/core';
import { ShopState } from '../../services/shop/shop_service';

@Component({
  selector: 'rat-phaser-wrapper',
  templateUrl: 'assets/templates/phaserwrapper/phaser_wrapper.ng.html',
  styleUrls: ['assets/css/phaserwrapper/phaser_wrapper.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhaserWrapperComponent implements OnChanges {
  @Input() shopState = ShopState.SHOP_HIDE;

  classes: readonly string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shopState']) {
      this.classes = this.generateClasses();
    }
  }

  generateClasses(): readonly string[] {
    if (this.shopState === ShopState.SHOP_SHOW) {
      return ['hidden'];
    }
    return [];
  }
}