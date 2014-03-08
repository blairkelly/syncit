var config = require('./config');
var http = require('http');

var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();           // start Express framework
app.configure(function(){
    app.use(express.static(__dirname + '/public'));
});
var server = require('http').createServer(app); // start an HTTP server
var io = require('socket.io').listen(config.remotemachinelisteningport);


io.configure(function(){
  io.set('log level', 1);  //tells IO socket to be mostly quiet.
});

function wf(thefile, filecontents, docallback) {
    fs.writeFile(thefile, filecontents, function () {
        console.log("Callback: Wrote to file.");
        io.sockets.emit('saved', true);
        if(docallback) {
          docallback();
        }
    });
}

var download_queue = "";
var downloading = "";

// Emit welcome message on connection
io.sockets.on('connection', function(socket) {

    var address = socket.handshake.address;
    console.log("Client connected at " + address.address + ":" + address.port);

    socket.emit('welcome', { 
        message: 'HELLO FROM REMOTE',
        address: address.address,
        basepathremote: config.bpr,
        filestowatch: config.filestowatch
    });

    socket.on('filechange', function(data) {
        console.log("changed file (as sent from server): " + data.changedfile);

        var modified_request_path = data.changedfile;
        if (  modified_request_path.match(/\\/)  ) {
            modified_request_path = modified_request_path.replace(/\\/g, '/');
        }
        var modified_file_location = config.bpr + data.changedfile;
        if (  modified_file_location.match(/\\/)  ) {
            //path contains a backslash. replace any existing forward slashes with backslashes.
            modified_file_location = modified_file_location.replace(/\//g, '\\');
        }
        modified_file_location = path.resolve(modified_file_location);  // <-- this is where it needs to go.
        //check if the file is in the "currently downloading" queue

        console.log("modified_request_path: " + modified_request_path);
        console.log("modified_file_location: " + modified_file_location);

        if(downloading.match(modified_request_path)) {
            //already downloading this file. add to download_queue for download later.
            if(download_queue.match(modified_request_path)) {
                //already in download queue, do nothing.
            } else {
                if(download_queue.length > 0) {
                    download_queue+=',';
                }
                download_queue+=modified_request_path;
            }
        } else {
            //not downloading yet.
            if(downloading.length > 0) {
                downloading+=',';
            }
            downloading+=modified_request_path;
        }

        console.log('downloading: ' + downloading);
        console.log('download_queue: ' + download_queue);

        //wf(modified_file_location, data.filecontents);
	});

});