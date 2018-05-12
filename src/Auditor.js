var HOST = '127.0.0.1';
var PORT_UDP = 58318;
var dgram = require('dgram');

udp_server = dgram.createSocket('udp4');

// TODO créer le dictionnaire



// event à la réception d'un message
// TODO tenir à jour un "dictionnaire"
udp_server.on("message", function (msg, rinfo) {
    console.log(msg.toString())
});

// event lors de l'écoute d'un message
udp_server.on('listening', () => {
    const address = udp_server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

/*
function checkActivity(){
    // TODO vérifier que tous les musiciens du dictionnaire soient actifs
}

setInterval(checkActivity, 1000);*/

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