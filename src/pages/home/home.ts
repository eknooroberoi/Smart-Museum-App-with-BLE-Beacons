import { Component,NgZone } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { IBeacon } from '@ionic-native/ibeacon';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { LocalStatusPage } from '../local-status/local-status';
import { connect, Client } from 'mqtt';
import { ElephantPage } from '../elephant/elephant';
import { BearPage } from '../bear/bear';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  client: Client;
  currentLocation = "";
  lastScan = 0;
  zone:any ;

  constructor(public navCtrl: NavController,private ibeacon: IBeacon,private localNotifications: LocalNotifications,
    public alertController: AlertController) {
    this.zone = new NgZone({ enableLongStackTrace: false });
    this.client = connect('mqtt://broker.hivemq.com/mqtt',{port:8000});
    this.client.subscribe('museum/helpconfirm');
    this.client.on('message',(topic:string,payload:string)=>{
      var confirmMessage = "";
      if(topic == 'museum/helpconfirm'){
        if(payload == 'busy'){
          confirmMessage = "Our guide is currently busy, kindly wait for some time or revist this piece at a later time!"
        } else {
          confirmMessage = "Our guide Ayesh is coming towards you!";
        }
        const alert = this.alertController.create({
          title: 'Update!',
          message: confirmMessage,
          buttons: ['OK']
        });
        alert.present();
      }
    });
  }

  ionViewWillEnter(){
    console.log('Before');
    let delegate = this.ibeacon.Delegate();
    console.log('After');
    // Subscribe to some of the delegate's event handlers
    //delegate- iBeacon delegate, it does functions on behalf of ibeacon plugin, it is necessay for certain functions
    //create a new delegate and register it with native layer
    //didEnterRegion,didRangeBeaconsInRegion,didStartMonitoringForRegion functions are observable
    //observable in ionic and angular are like, they are waiting for events, once an event occur certain part of code runs
    /*Anyways as I was saying it's like an observable and the syntax of observable is once you call the function
    you have whatever event you're waiting for you write it as the syntax of the function syntax and then
    you subscribe to it.So subscription is something that you are subscribing to an event and once that event occurs.
    If there is data that is transmitted by the event you can do something with that data. Or if there's an error you can console the error.
    You can console the log the error.*/
    //didRangeBeaconsInRegion- observable waiting for if the phone(device) ranged beacon
    /*So what we are waiting for over here is if your device ranged beacon, so as I was saying the terminology
    range means that it scanned like it did a circular like a zone scan in this region 
    once it's entered the region it did a scan and it receives packets from the beacons.
    So it did one scan and whatever packets it got it will get that in this array.(data)
    It's an array of objects. So you can you can like basically it's actually the object itself is called the Ibeacon plug result.
    */
   //didStartMonitoringForRegion= It's an observable that is waiting to for the start monitoring for region.
  //So once we call this function start monitoring for region this event is fired that a device started
  //monitoring for region.
  //So it did start monitoring for region and then we can run this part of the code.
  //It's like we've created a region We started monitoring for region and once we actually enter the region this region we've entered it.
  //This event should be fired.And it gives the data and you can see this is also an I can plug in result format and this is what these 8things are.
    delegate.didStartMonitoringForRegion()
      .subscribe(
        data => console.log('didStartMonitoringForRegion: ', data),
        error => console.log(error)
      );
    delegate.didEnterRegion()
      .subscribe(
        data => {
          console.log('didEnterRegion: ', data);
          this.client.publish('museum/entry','entered');
          this.localNotifications.schedule({
            id: 1,
            title:'SmartMuseum',
            text: 'Welcome to SmartMuseum!',
            trigger: {at: new Date(new Date().getTime())}
          });
        }
      );
    delegate.didDetermineStateForRegion().subscribe(data => {
      let state = data.state;
      if(state == 'CLRegionStateInside'){
        this.client.publish('museum/entry','entered');
        this.localNotifications.schedule({
          id: 1,
          title:'SmartMuseum',
          text: 'Welcome to SmartMuseum!',
          trigger: {at: new Date(new Date().getTime())}
        });
      }
    });
    delegate.didRangeBeaconsInRegion().subscribe(
      data => {
        this.zone.run(() => {
          if (data.beacons.length > 0) {
            data.beacons.forEach((beacon) => {
              if (beacon.proximity == 'ProximityImmediate' && beacon.minor != this.lastScan) {
                console.log('Got data Ranging Beacons Publishing this data! -> ' + JSON.stringify(beacon));
                switch (Number(beacon.minor)) {
                  case 3588: this.currentLocation = "Burman Elephant";
                    console.log('Reached switch statement');
                    this.lastScan = 3588;
                    break;
                  case 35730: this.currentLocation = "Golden Bear";
                    console.log('Got horse');
                    this.lastScan = 35730;
                    break;
                }
              }
            })
          }
        })
      },
      error => console.error()
    );
    console.log('BEEFFOOREEE');
    //B9407F30-F5F8-466E-AFF9-25556B579999= is UUID of beacon set we have, this UUID can be modified,
    //but whatever u modify it to, should be reflected here,
    //deskBeacon= it is a name given to the whole set of beacons or region, therefore it is called deskregion, bed etc
    //B9407F30-F5F8-466E-AFF9-25556B579999= it is  important part, it tells the plugin, which set of beacons or which region are we looking out for
    //beaconRegion= creates beacon region with this UUID, now we start monitoring for the region
    //to modify beacon, major, minor use cloud.estimo.com
    //enable ibeacon packet, copy proximity uuid, we can modify uuid, major, minor
    //we can modify interval for certain projects when we want frequency of transmission to increase,ie more number of packets transmitted in a time period, we have to decrease interval 
    // min intervalis 100 ms. if beacon is transmitting packets very fast, we can increase interval ex: from 100 to 500ms 
    //broadcasting power is how strong the signal should be so that phone can receive it.
    //we want broadcasting power to be weeker(going in -ve it becomes stronger and going in positive, it becomes weeker, here +ve),
    //as it is a small setting , i dont want my phone to receive packets from something that is not immediately close to me, therefore weeker
    //as we want to get notification for only near by objects
    let beaconRegion = this.ibeacon.BeaconRegion('deskBeacon', 'B9407F30-F5F8-466E-AFF9-25556B579999',12870);
    console.log('Afterrrr');
    this.ibeacon.startMonitoringForRegion(beaconRegion)
    //.then is asynchronous task(when a promise is resolved, it runs a specific piece of code), when the task is done, .then runs the part of code, inside its brackets. it is js specific syntax
      .then(
        () => console.log('Native layer received the request to monitoring'),
        error => console.error('Native layer failed to begin monitoring: ', error)
      );
    this.ibeacon.requestStateForRegion(beaconRegion).then(result => {
      console.log('Requested: ' + result);
    });
    this.ibeacon.startRangingBeaconsInRegion(beaconRegion)
      .then(
        () => {
          console.log('Started Ranging!');
        },
        error => {
          console.error('Failed to begin monitoring: ', error);
        }
      );
  }

  onViewConditions(){
    this.navCtrl.push(LocalStatusPage);
  }

  onRequestHelp(){
    this.client.publish('museum/help',this.currentLocation);
    const alert = this.alertController.create({
      title: 'Request Sent!',
      message: 'A free guide should come to help you soon!',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });
    alert.present();
  }

  onElephant(){
    this.navCtrl.push(ElephantPage);
  }

  onBear(){
    this.navCtrl.push(BearPage);
  }

}
