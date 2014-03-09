var config = require('./config');

var filestowatch = new Array();

for(var i=0; i< config.filestowatch.length; i++) {
    filestowatch.push(config.filestowatch[i]);
}

console.log(filestowatch);

var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();           // start Express framework
app.configure(function(){
    app.use(express.static(__dirname + '/public'));
});
var server = require('http').createServer(app); // start an HTTP server
var io_local = require('socket.io').listen(server);

io_local.configure(function(){
  io_local.set('log level', 1);  //tells IO socket to be mostly quiet.
});

server.listen(config.localmachinegruntport);
console.log("To connect, use port " + config.localmachinegruntport);

// Emit welcome message on connection
io_local.sockets.on('connection', function(socket) {
    var address = socket.handshake.address;
    console.log("Client connected at " + address.address + ":" + address.port);

    socket.emit('welcome', { 
        message: 'Local, READY TO SERVE',
        address: address.address
    });

    socket.on('get', function(data) {
      if(data == 'config') {
        var config_to_send = {
          BPR: config.bpr,
          GETPORT: config.localmachinegruntport
        }
        socket.emit('config', config_to_send);
      }
    });
});

//read file
var rf = function(thefile) {
    data = fs.readFile(thefile, {encoding: 'utf-8'});
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
		  console.log(target + ': ' + filepath + ' has been ' + action);
      if(fs.existsSync(filepath)) {
        var resolved_filepath = path.resolve(filepath);
        var remove_from_path = path.resolve(config.bpl);
        var prepped_path = resolved_filepath.replace(remove_from_path, '');
        console.log("prepped path: " + prepped_path);
      }
      if(action != 'deleted') {
        io_local.sockets.emit('filechange', {
            changedfile: prepped_path,
            isDir: fs.lstatSync(filepath).isDirectory()
        });
      } else if (action == 'deleted') {
        console.log("DELETED: " + filepath);
        io_local.sockets.emit('filedeleted', {
            deletedfile: filepath
        });
      }
	});
};

app.get('/source/*', function (request, response) {
    var requestedFile = path.resolve(config.bpl + '/' + request.params[0]);
    response.sendfile(requestedFile, function (error) {
      //upon completion.
      if(error) {
        console.log('Error trying to send file.');
      }
    });
});