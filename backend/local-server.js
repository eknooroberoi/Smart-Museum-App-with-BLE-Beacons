const BeaconScanner = require('node-beacon-scanner');
const scanner = new BeaconScanner();
var _ = require('lodash');
const mqtt = require('mqtt');

var shopTemp = 0;
var shopLight = 0;
var crowd_count = 0;

var idTable = {
    '3588' :"9444b13dd115698b",
    '35730':"62e87562c16f5a00",
    '58350':"b412563294cdc461"    
}

// var mqtt_client = mqtt.connect(broker);

var mqtt_client2 = mqtt.connect('mqtt://broker.hivemq.com');
mqtt_client2.subscribe('museum/entry');
mqtt_client2.on('message',(topic,payload)=>{
    if(topic == 'museum/entry' && payload == 'entered'){
        crowd_count ++;
    }
});
setInterval(()=>{
    mqtt_client2.publish('cafe/status',JSON.stringify({temperature:shopTemp,ambientLight:shopLight, crowd_count:crowd_count}));
    console.log('Published status information');
    console.log(shopLight);
    console.log(shopTemp);
},10000);

// mqtt_client2.on('message', (topic, payload) => {
//     var loggedoutuser = payload;
//     userTracker = _.remove(userTracker, { user: loggedoutuser });
// });

mqtt_client2.on('connect', function () {
    scanner.onadvertisement = (ad) => {
        if (ad.beaconType == "estimoteTelemetry" && ad.estimoteTelemetry.subFrameType == 1) {
            var minor = _.findKey(idTable, _.partial(_.isEqual, ad.estimoteTelemetry.shortIdentifier));
            if (minor == "3588") {
                var temp = ad.estimoteTelemetry.temperature;
                var light = ad.estimoteTelemetry.light;
                shopTemp = temp;
                shopLight = light;
                console.log(ad.estimoteTelemetry.shortIdentifier);
            }

        }
    }
    // Start scanning
    setInterval(() => {
        scanner.startScan().then(() => {
            console.log('Started to scan.');
            setTimeout(() => {
                scanner.stopScan();
            }, 15000);
        }).catch((error) => { console.error(error); });

    }, 30000);
}
);