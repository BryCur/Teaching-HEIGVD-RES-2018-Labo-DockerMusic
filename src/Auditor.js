var HOST = '127.0.0.1';
var PORT_UDP = 58318;
var dgram = require('dgram');
var moment = require('moment');

var udp_server = dgram.createSocket('udp4');


function Musicien(uuid, instrument, lastContact){
    this.id = uuid;
    this.instrument = instrument;
    this.lastContact = lastContact;
}

var mapMusicien = new Map();

var mapInstrument = new Map();

mapInstrument.set("ti-ta-ti", "piano");
mapInstrument.set("trulu", "flute");
mapInstrument.set("pouet", "trumpet");
mapInstrument.set("gzi-gzi", "violin");
mapInstrument.set("boum-boum", "drum");

// event à la réception d'un message
udp_server.on("message", function (msg, rinfo) {
    var payload = JSON.parse(msg.toString());
    var sonRecu = payload.noise;
    var uuid = payload.id;
    var reception = moment().format('YYYY-MM-DD HH:mm:ss');
    var instrument = mapInstrument.get(sonRecu);
    console.log(sonRecu + " FROM " + uuid);


    mapMusicien.set(uuid, new Musicien(uuid, instrument, reception));
    console.log(msg.toString())
});

// event lors de l'écoute d'un message
udp_server.on('listening', () => {
    const address = udp_server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});


function checkActivity(){
    for (var [cle, valeur] of mapMusicien){
        var now =  moment();
        var reception = moment(valeur.lastContact);
        var diff = moment.duration(now.diff(reception)).as("seconds");


        //console.log(diff)
        if(diff > 5){
            mapMusicien.delete(cle);
            //console.log("on a delete un truc poto")
        }
    }
}

setInterval(checkActivity, 1000);

udp_server.bind(PORT_UDP, HOST);


// TCP PART
// à la connexion d'un client : donner la liste des musiciens actifs
// load the Node.js TCP library
const net = require('net');

const PORT_TCP = 58318;

tcp_server = net.createServer(onClientConnected);
tcp_server.listen(PORT_TCP, HOST);

function onClientConnected(socket) {
    var tabMusician = [];
    for (var [cle, valeur] of mapMusicien){
        tabMusician.push(valeur);
    }
    socket.write(JSON.stringify(tabMusician));
    socket.destroy();
}