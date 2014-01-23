var config = require('./config');

var partnerlocation = config.partnerlocation;
var partnerport = config.partnerport;
var localport = config.localport;

var filestowatch = config.filestowatch;

var fs = require('fs');
var app = require('express')(),           // start Express framework
    server = require('http').createServer(app), // start an HTTP server
    io_local = require('socket.io').listen(server);


app.get('/', function (request, response) {
  response.sendfile(__dirname + '/index.html');
});
app.get('/client_config.js', function (request, response) {
  response.sendfile(__dirname + '/client.js');
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
    });
});

//read file
var rf = function(thefile) {
    data = fs.readFileSync(thefile, {encoding: 'utf-8'});
    return data;
}

module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Project configuration.
	grunt.initConfig({
		watch: {
			files: filestowatch
	    }
	});

	grunt.registerTask('default', 'watch');

	grunt.event.on('watch', function(action, filepath, target) {
		console.log(target + ': ' + filepath + ' has ' + action);
	  	var file_contents = rf(filepath);
	  	io_local.sockets.emit('filechange', { 
        	changedfile: filepath,
        	filecontents: file_contents
    	});
	});

};