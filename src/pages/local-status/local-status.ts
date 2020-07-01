import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { connect, Client } from 'mqtt';

@IonicPage()
@Component({
  selector: 'page-local-status',
  templateUrl: 'local-status.html',
})
export class LocalStatusPage {
  client: Client;
  temperature = 0;
  brightness = 0;
  crowd_count = 0;
  zone:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.zone = new NgZone({ enableLongStackTrace: false });
    this.client = connect('mqtt://broker.hivemq.com/mqtt',{port:8000});
    this.client.on('message',(topic:string,payload:string)=>{
      const info = JSON.parse(payload);
      this.zone.run(()=>{
        this.crowd_count = info.crowd_count;
        this.temperature = info.temperature;
        this.brightness = info.ambientLight;
      });
    });
  }

  ionViewWillEnter(){
    this.client.subscribe('cafe/status');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopStatusPage');
  }

}
