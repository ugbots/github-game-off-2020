import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { PhaserWrapperComponent } from './phaser_wrapper';

@NgModule({
  imports: [BrowserModule],
  declarations: [PhaserWrapperComponent],
  exports: [PhaserWrapperComponent],
})
export class PhaserWrapperModule {}
