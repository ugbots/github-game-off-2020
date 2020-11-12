import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { of } from 'rxjs';
import { ShopService } from '../../services/shop/shop_service';

@Component({
  selector: 'rat-main',
  templateUrl: 'assets/templates/main.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  constructor(@Inject(ShopService) private readonly shopService: ShopService) { }

  readonly shopState$ = this.shopService.getShopState$();
}
