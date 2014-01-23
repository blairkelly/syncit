var locationhostname = window.location.hostname;
var serverip = locationhostname;

var locationport = window.location.port;
var serverport = locationport;

var socket = io.connect('//'+serverip+':'+serverport);
socket.on('welcome', function(data) {
    console.log(data.message);
    console.log('Handshake address: ' + data.address);
});
