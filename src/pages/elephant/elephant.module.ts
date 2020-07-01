import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ElephantPage } from './elephant';

@NgModule({
  declarations: [
    ElephantPage,
  ],
  imports: [
    IonicPageModule.forChild(ElephantPage),
  ],
})
export class ElephantPageModule {}
