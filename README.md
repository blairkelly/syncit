syncit
======

Node program watches files for changes then syncs to remote, also running node.

Purpose is to facilitate IIS/Asp.NET development on a mac while server actually runs on an external computer.

Please note you need a client_config.js in the root folder

it must contain something like this:

var partnerlocation = "10.0.1.8";   //home, local
var partnerport = 3500;  //local