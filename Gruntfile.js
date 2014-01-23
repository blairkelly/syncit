var config = require('./config');

var partnerlocation = config.partnerlocation;
var partnerport = config.partnerport;
var localport = config.localport;
var path = config.filepath;
var filestowatch = config.filestowatch;

var fs = require('fs');
var app = require('express')(),           // start Express framework
    server = require('http').createServer(app), // start an HTTP server
    io_local = require('socket.io').listen(server);


app.get('/', function (request, response) {
  response.sendfile(__dirname + '/index.html');
});
app.get('/client.js', function (request, response) {
  response.sendfile(__dirname + '/client.js');
});
app.get('/style.css', function (request, response) {
  response.sendfile(__dirname + '/style.css');
});
app.get('/jquery-2.0.3.min.js', function (request, response) {
  response.sendfile(__dirname + '/jquery-2.0.3.min.js');
});
app.get('/jquery-2.0.3.min.map', function (request, response) {
  response.sendfile(__dirname + '/jquery-2.0.3.min.map');
});

io_local.configure(function(){
  io_local.set('log level', 1);  //tells IO socket to be mostly quiet.
});

server.listen(config.localport);


// Emit welcome message on connection
io_local.sockets.on('connection', function(socket) {
    var address = socket.handshake.address;
    console.log("Client connected at " + address.address + ":" + address.port);

    socket.emit('welcome', { 
        message: 'Welcome',
        address: address.address
    }); //was: socket.emit('welcome', { message: 'Hi', time: new Date().toJSON() });
});

module.exports = function(grunt) {
	//All to stop caching...

	grunt.loadNpmTasks('grunt-contrib-watch');

	// Project configuration.
	grunt.initConfig({
		watch: {
			files: [path+filestowatch]
	    }
	});

	grunt.registerTask('default', 'watch');

	grunt.event.on('watch', function(action, filepath, target) {
	  grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});

};