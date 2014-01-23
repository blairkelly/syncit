var partnerlocation = "10.0.1.8";
var partnerport = 2008;

var locationhostname = window.location.hostname;
var serverip = locationhostname;

var locationport = window.location.port;
var serverport = locationport;

var socket = io.connect('//'+serverip+':'+serverport);
socket.on('welcome', function(data) {
    console.log(data.message);
    console.log('Handshake address: ' + data.address);
});


var socket_remote = io.connect('//'+partnerlocation+':'+partnerport);
socket_remote.on('welcome', function(data) {
    console.log("Connected remote");
    console.log(data.message);
    console.log('Handshake address: ' + data.address);
});