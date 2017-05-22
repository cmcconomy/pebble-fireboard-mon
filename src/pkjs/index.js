"use strict";

// Import the Clay package
var Clay = require('pebble-clay');
// Load our Clay configuration file
var clayConfig = require('./config');

var Fireboard = require('./fireboard');

function login(username,password) {
    Fireboard.login(username,password)
    	.then(Fireboard.storeToken)
    	.then(Fireboard.getFirstDevice)
    	.then(Fireboard.storeUUID)
    	.then(Fireboard.getTemps)
    	.then((obj)=>{console.log("Result: " + JSON.stringify(obj))})
    	.catch((err)=>{console.log("Error - " + JSON.stringify(err))});
}

function sendMessage(){}

function initClay() {
	// Initialize Clay
	var clay = new Clay(clayConfig);
}

Pebble.addEventListener('ready', function() {
  // PebbleKit JS is ready!
  console.log('PebbleKit JS ready!');
  initClay();

  var claySettings = JSON.parse(localStorage.getItem('clay-settings'));
  console.log(JSON.stringify(claySettings))
  login(claySettings["Config_Username"], claySettings["Config_Password"]);

});