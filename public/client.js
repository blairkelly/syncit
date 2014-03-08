var locationhostname = window.location.hostname;
var serverip = locationhostname;

var locationport = window.location.port;
var serverport = locationport;

var socket = io.connect('//'+serverip+':'+serverport);
socket.on('welcome', function(data) {
	console.log("Connected LOCAL");
    console.log(data.message);
    console.log('Handshake address: ' + data.address);

    var socket_remote = io.connect('//'+remote_machine_address+':'+remote_machine_port);
	socket_remote.on('welcome', function(data) {
	    console.log("Connected remote");
	    console.log(data.message);
	    console.log('Handshake address: ' + data.address);
	    socket.emit('give', 'BPR');
	});

    socket.on('filechange', function(data) {
	    socket_remote.emit('filechange', data);
	});
	socket.on('filedeleted', function(data) {
	    socket_remote.emit('filedeleted', data);
	});
	socket.on('BPR', function(data) {
	    socket_remote.emit('BPR', data);
	});
});