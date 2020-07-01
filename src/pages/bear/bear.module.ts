import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BearPage } from './bear';

@NgModule({
  declarations: [
    BearPage,
  ],
  imports: [
    IonicPageModule.forChild(BearPage),
  ],
})
export class BearPageModule {}
