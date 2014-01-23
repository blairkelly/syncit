var config = require('./config');

var filepath = config.filepath;
var filestowatch = config.filestowatch;

var fs = require('fs');
var io = require('socket.io').listen(config.partnerport);

io.configure(function(){
  io.set('log level', 1);  //tells IO socket to be mostly quiet.
});

// Emit welcome message on connection
io.sockets.on('connection', function(socket) {
    var address = socket.handshake.address;
    console.log("Client connected at " + address.address + ":" + address.port);

    socket.emit('welcome', { 
        message: 'Welcome',
        address: address.address,
        path: path,
        filestowatch: filestowatch
    }); 
});