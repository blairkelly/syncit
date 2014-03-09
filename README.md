syncit
======

Node program watches files for changes then syncs to remote, also running node.

Purpose is to facilitate IIS/Asp.NET development on a mac while server actually runs on an external computer.

Please note private.js is needed in public/ folder

it must contain something like this:

var remote_machine_address = "10.0.1.8";   //home, local
var remote_machine_port = 3500;  //local

/*
There is currently a very annoying error where an ENOENT or EPERM error is thrown when directors are deleted.
This is probably due to a limitation in the grunt watch script. My research into the problem suggests it has
something to do with grunt watch trying to access a folder in its watch list that no longer exists and is not
correctly handling the error that is thrown. One suggestion I saw was to "not watch a folder you're going to delete,
but to watch it's parent."
I will let this issue sit for a while in case it is fixed in the next grunt / grunt-watch releases... I'll live
with the inconvenience for the time being, until I get fed up and fix it myself.
*/