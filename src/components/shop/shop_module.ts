import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ShopComponent } from './shop';

@NgModule({
  imports: [BrowserModule],
  declarations: [ShopComponent],
  exports: [ShopComponent],
})
export class ShopModule {}
