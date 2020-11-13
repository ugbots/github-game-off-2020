import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from '../button/button_module';
import { TabsModule } from '../tabs/tabs_module';

import { ShopComponent } from './shop';
import { ShopPanelComponent } from './shop_panel';

@NgModule({
  imports: [BrowserModule, TabsModule],
  declarations: [ShopComponent, ShopPanelComponent],
  exports: [ShopComponent],
})
export class ShopModule {}
