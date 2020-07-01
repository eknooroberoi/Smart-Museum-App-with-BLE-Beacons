import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocalStatusPage } from './local-status';

@NgModule({
  declarations: [
    LocalStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(LocalStatusPage),
  ],
})
export class LocalStatusPageModule {}
