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
    var _BPR = null;
    var GETPORT = null;
    console.log("Client connected at " + address.address + ":" + address.port);
    socket.emit('welcome', { 
        message: 'HELLO FROM REMOTE',
        address: address.address,
        filestowatch: config.filestowatch
    });
    socket.on('config', function(data) {
        _BPR = data.BPR;
        console.log("_BPR set to " + _BPR);
        GETPORT = data.GETPORT;
        console.log("GETPORT set to " + GETPORT);
    });
    socket.on('filedeleted', function(data) {
        console.log(" ");
        console.log("DELETE");
        var deleted_path = _BPR + data.deletedfile;
        var resolved_deleted_path = path.resolve(deleted_path);  //looks like path.resolve fixes slash direction...
        console.log("resolved_deleted_path: " + resolved_deleted_path);
        var dirname = path.dirname(resolved_deleted_path);
        console.log("dirname is: " + dirname);
        fs.exists(resolved_deleted_path, function(exists) {
            if(exists) {
                //check locally if path is file or directory.
                if(fs.lstatSync(resolved_deleted_path).isDirectory()) {
                    console.log("Is Directory.");
                    fs.rmdir(resolved_deleted_path, function(err) {
                        if (err) {
                            console.log("There was an error: ");
                            console.log(err);  
                        } else {
                            console.log('successfully deleted');
                        }; 
                    });
                } else {
                    console.log("Is File.");
                    fs.unlink(resolved_deleted_path, function (err) {
                        if (err) {
                            console.log("There was an error: ");
                            console.log(err);  
                        } else {
                            console.log('successfully deleted');
                        };
                    });
                }
            } else {
                console.log("Doesn't exist, can't delete.");
            }
        });
    });
    socket.on('filechange', function(data) {
        console.log(" ");
        console.log("CHANGED");
        var add_item_to_list = function (list, item) {
            if(list.match(item)) {
                //item already in list, do nothing
            } else {
                //not in list yet
                if(list.length > 0) {
                    list+=',';
                }
                list+=item;
            }
            return list;
        }
        var remove_item_from_list = function(list, item) {
            var n = list.indexOf(item);
            if(n!=0) {
                list = list.replace(','+item, '');
            } else {
                list = list.replace(item, '');
            }
            if(list.charAt(0) == ','){
                list = list.substring(1, list.length);
            }
            return list;
        }
        var get_file = function (fp) {
            console.log("get_file: " + fp);
            downloading = add_item_to_list(downloading, fp);
            var get_file_options = {
              host: address.address,
              port: GETPORT,
              path: '/source/' + fp
            };
            var modified_file_location = _BPR + data.changedfile;
            modified_file_location = path.resolve(modified_file_location);  // <-- this is where it needs to go.
            modified_file_location = path.normalize(modified_file_location);
            console.log("modified_file_location: " + modified_file_location);
            var dirname = path.dirname(modified_file_location);
            console.log("dirname: " + dirname);
            var do_get = function () {
                if(!data.isDir) {
                    //it's not just a directory. GET the file.
                    console.log("getting...");
                    http.get(get_file_options, function(res) {
                        res.pipe(fs.createWriteStream(modified_file_location));
                        res.on('end', function(e) {
                            console.log("Finished getting " + fp);
                            downloading = remove_item_from_list(downloading, fp);
                            //check if the file is in download queue
                            if(download_queue.match(fp)) {
                                //it's in the download queue.
                                //remove from download queue.
                                //add to downloading
                                download_queue = remove_item_from_list(download_queue, fp);
                                get_file(fp);
                            }
                            console.log('downloading: ' + downloading);
                            console.log('download_queue: ' + download_queue);
                        });
                    }).on('error', function(e) {
                        console.log("HTTP GET ERROR: " + e.message);
                    });
                } else {
                    console.log("Directory Only. Not getting.");
                }
            }
            fs.exists(modified_file_location, function(exists) {
                if(exists) {
                    //excellent, do nothing.
                    do_get();
                } else {
                    //doesn't exist
                    console.log("directory does not exist. Creating...");
                    //if it's a directory, then create the directory.
                    if(data.isDir) {
                        fs.mkdir(modified_file_location, function () {
                            console.log("Successfully created directory.");
                        });
                    } else {
                        //it's not just a directory, it's a file.
                        //check to make sure the directory exists, then fetch the file.
                        fs.exists(dirname, function(exists) {
                            if(exists) {
                                //excellent, file does not exist but the directory does
                                do_get();
                            } else {
                                fs.mkdir(dirname, function () {
                                    console.log("Successfully created directory.");
                                    do_get();
                                });
                            }
                        });
                    }
                }
            });
        }
        var modified_request_path = data.changedfile;
        if (  modified_request_path.match(/\\/)  ) {
            modified_request_path = modified_request_path.replace(/\\/g, '/');
        }
        console.log("modified_request_path: " + modified_request_path);
        if(downloading.match(modified_request_path)) {
            //already downloading this file. add to download_queue for download later.
            download_queue = add_item_to_list(download_queue, modified_request_path);
            console.log("Queued: " + modified_request_path);
        } else {
            //not downloading yet.
            get_file(modified_request_path);
        }
	});
});