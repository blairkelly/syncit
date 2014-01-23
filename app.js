var config = require('./config');

var partnerlocation = config.partnerlocation;
var partnerport = config.partnerport;

var filepath = config.filepath;
var filestowatch = config.filestowatch;

var fs = require('fs');
var io = require('socket.io').listen(partnerport);

io.configure(function(){
  io.set('log level', 1);  //tells IO socket to be mostly quiet.
});

var socket = io.connect('//'+partnerlocation+':'+partnerport);
socket.on('welcome', function(data) {
    console.log(data.message);
    console.log('Handshake address: ' + data.address);
    imagepath = data.imagepath;
    $('.quickinfo').html("<span>XML:</span> " + data.xmlfile + "<br/><span>Images:</span> " + imagepath);
});