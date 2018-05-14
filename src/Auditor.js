var HOST = '127.0.0.1';
var PORT_UDP = 58318;
var dgram = require('dgram');
var moment = require('moment');

udp_server = dgram.createSocket('udp4');


function Musicien(uuid, instrument, lastContact){
    this.id = uuid;
    this.instrument = instrument;
    this.lastContact = lastContact;
}

var mapMusicien = new Map();



// event à la réception d'un message
udp_server.on("message", function (msg, rinfo) {
    var payload = JSON.parse(msg.toString());
    var sonRecu = payload.noise;
    var uuid = payload.id;
    var reception = moment().format('MMMM D YYYY, HH:mm:ss');
    var instrument;
    console.log(sonRecu + " FROM " + uuid);
    switch(sonRecu){
        case "ti-ta-ti" :
            instrument = "piano";
            break;
        case "pouet" :
            instrument = "trumpet";
            break;
        case "gzi-gzi" :
            instrument = "violin";
            break;
        case "trulu" :
            instrument = "flute";
            break;
        case "boum-boum" :
            instrument = "drum";
            break;
    }

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
        var now =  moment().format('MMMM D YYYY, HH:mm:ss');
        var reception = valeur.lastContact;

        if(now.sub(5, 'seconds') >= reception){
            mapMusicien.delete(cle);
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
    // TODO ENVOYER LE DICO SERIALISÉ
    socket.write("t'es connecté poto");
    socket.destroy();
}