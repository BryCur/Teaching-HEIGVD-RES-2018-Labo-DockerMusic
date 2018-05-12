var HOST = '127.0.0.1';
var PORT = 58318;
var dgram = require('dgram');
var uuid = require("uuid/v4");

var UUID = uuid();

function Instrument(name, sound) {
    this.name = name;
    this.sound = sound;
}

var instrument ;

switch (process.argv[3]){
    default:
    case "piano"  :
        instrument = new Instrument("piano", "ti-ta-ti");
        break;
    case "trumpet"  :
        instrument = new Instrument("trumpet", "pouet");
        break;
    case "flute"  :
        instrument = new Instrument("flute", "trulu");
        break;
    case "violin"  :
        instrument = new Instrument("violin", "gzi-gzi");
        break;
    case "drum"  :
        instrument = new Instrument("drum", "boum-boum");
        break;

}

function send(payload) {
    var server = dgram.createSocket('udp4');
    server.send(payload, 0, payload.length, PORT, HOST,
        function (err, byte) {
            console.log("message sent to " + HOST + ":" + PORT);
        });

}

var payload = JSON.stringify({id : UUID, noise : instrument.sound});
console.log("payload : " + payload);
setInterval(send, 1000, payload);

