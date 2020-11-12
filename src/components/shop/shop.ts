import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ShopService, ShopState } from '../../services/shop/shop_service';

@Component({
  selector: 'rat-shop',
  templateUrl: 'assets/templates/shop.ng.html',
  styleUrls: ['assets/css/shop.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopComponent implements OnChanges {
  @Input() shopState = ShopState.SHOP_SHOW;

  hidden = true;

  constructor(@Inject(ShopService) private readonly shopService: ShopService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shopState']) {
      this.hidden = this.shopState === ShopState.SHOP_HIDE;
    }
  }

  closeShop(): void {
    this.shopService.finishShopping();
  }
}
