import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IBeacon } from '@ionic-native/ibeacon';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LocalStatusPage } from '../pages/local-status/local-status';
import { ElephantPage } from '../pages/elephant/elephant';
import { BearPage } from '../pages/bear/bear';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LocalStatusPage,
    ElephantPage,
    BearPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LocalStatusPage,
    ElephantPage,
    BearPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    IBeacon,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
