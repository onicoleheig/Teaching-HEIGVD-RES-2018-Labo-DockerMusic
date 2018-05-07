var protocol = require('./protocol');

var dgram = require('dgram');

var net = require('net');

var socket = dgram.createSocket('udp4');

var musicians = [];

//listen to multicast
socket.bind(protocol.PORT, function () {
    console.log("Now listen to multicast : " + protocol.MULTICAST_ADDRESS + ":" + protocol.PORT);
    socket.addMembership(protocol.MULTICAST_ADDRESS);
});

//event when recieve a message !
socket.on('message', function(msg, src) {
    console.log('Received a new message : ' + msg);
    
    var json = JSON.parse(msg);

    for (var i = 0; i < musicians.length; i++) {
        if (json.uuid == musicians[i].uuid) {
            musicians[i].activeSince = new Date();
            return;
        }
    }

    json.activeSince = new Date();
    musicians.push(json);
});

//TCP server
var tcpServer = net.createServer();
tcpServer.listen(protocol.PORT);
console.log("TCP Server now running on port : " + protocol.PORT);

tcpServer.on('connection', function (socket) {
    socket.write(JSON.stringify(musicians));
    socket.destroy();
});

setInterval(checkInstruments, 1000);

//delete musician if he doesn't play until some seconds (MAX_DELAY)
function checkInstruments() {
    for (var i = 0; i < musicians.length; i++) {
        if (new Date() - musicians[i].activeSince > protocol.MAX_DELAY) {
            console.log('Mucisian removed : ' + JSON.stringify(musicians[i]));
            musicians.splice(i, 1);
        }
    }
}