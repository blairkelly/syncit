var config = require('./config');

var serverfilepath = config.serverfilepath;
var filestowatch = config.filestowatch;


var fs = require('fs');
var app = require('express')();           // start Express framework
var server = require('http').createServer(app); // start an HTTP server
var io = require('socket.io').listen(config.partnerport);


io.configure(function(){
  io.set('log level', 1);  //tells IO socket to be mostly quiet.
});

function wf(thefile, filecontents) {
    fs.writeFileSync(thefile, filecontents);
    console.log("Wrote to file.");
    io.sockets.emit('saved', true);
}

// Emit welcome message on connection
io.sockets.on('connection', function(socket) {
    var address = socket.handshake.address;
    console.log("Client connected at " + address.address + ":" + address.port);

    socket.emit('welcome', { 
        message: 'Welcome',
        address: address.address,
        serverfilepath: serverfilepath,
        filestowatch: filestowatch
    });

    socket.on('filechange', function(data) {
    	wf(data.changedfile, data.filecontents);
	});
});