var protocol = require('./protocol');

var dgram = require('dgram');

var uuid = require('uuid');

var socket = dgram.createSocket('udp4');

//sounds array
const SOUNDS = {
    piano: "ti-ta-ti",
    trumpet: "pouet",
    flute: "trulu",
    violin: "gzi-gzi",
    drum: "boum-boum"
};

var instrument = process.argv[2];

if(instrument === undefined){
    console.log("Error : instrument undefined.\nplease choose between : \n -> piano\n -> trumpet\n -> flute\n -> violin\n -> drum");
    process.exit(1);
}

var json = {
    uuid: uuid(),
    instrument: process.argv[2]
};

setInterval(sendMessage, 1000);

//send the message to the broadcast address
function sendMessage() {
    var message = JSON.stringify(json);
    console.log(' *' + SOUNDS[json.instrument] + '* - sent: ' + message);

    socket.send(message, protocol.PORT, protocol.MULTICAST_ADDRESS, function (err, bytes) {
        if (err) throw err;
    });
}