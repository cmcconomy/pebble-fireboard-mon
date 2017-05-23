"use strict";

// Import the Clay package
var Clay = require('pebble-clay');
// Load our Clay configuration file
var clayConfig = require('./config');

var Fireboard = require('./fireboard');
// required for "array" style keys
var keys = require('message_keys');

function login(username,password) {
    Fireboard.login(username,password)
    	.then(Fireboard.storeToken)
    	.then(Fireboard.getFirstDevice)
    	.then(Fireboard.storeUUID)
    	.then(Fireboard.getTemps)
    	.then((obj)=>{console.log("Result: " + JSON.stringify(obj))})
    	.catch((err)=>{console.log("Error - " + JSON.stringify(err))});
}

function sendTempsToPebble(channels){
  var dict = {};
  for( var i=0; i<6; i++ ) {
    dict[keys.Channel_Connected+i] = channels[i].isConnected;
    dict[keys.Channel_Temp     +i] = channels[i].temp;
    dict[keys.Channel_TempUnit +i] = channels[i].unit;
    dict[keys.Channel_UpdatedAt+i] = channels[i].updatedAt;
  }

  Pebble.sendAppMessage(dict,
    () => {console.log("Pebble JS: Successfully sent " + JSON.stringify(dict))},
    (err) => {console.log("Pebble JS: Could not send \n" + JSON.stringify(dict) + ",\n due to \n" + JSON.stringify(err))}
    );
}

function retrieveTemps() {
  Fireboard.getTemps(sessionStorage.getItem('uuid')).then(sendTempsToPebble);
  setTimeout(retrieveTemps,5000);
}

function initClay() {
	// Initialize Clay
	var clay = new Clay(clayConfig);
}

Pebble.addEventListener('ready', function() {
  // PebbleKit JS is ready!
  console.log('PebbleKit JS ready!');
  initClay();

  var claySettings = JSON.parse(localStorage.getItem('clay-settings'));
  login(claySettings["Config_Username"], claySettings["Config_Password"]);
  retrieveTemps();

  //setTimeout(retrieveTemps,2000);
});