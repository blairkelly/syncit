var config = require('./config');

var partnerlocation = config.partnerlocation;
var partnerport = config.partnerport;
var path = config.filepath;
var filestowatch = config.filestowatch;

var fs = require('fs');
var io = require('socket.io').listen(partnerport);

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