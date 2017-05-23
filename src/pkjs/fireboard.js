"use strict";

var Channel = require('./channel');

function login(username, password) {
  return new Promise((resolve, reject) => {

    console.log("Trying to log in with " + username + ", " + password)
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if(xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText).key);
        } else {
          reject({desc:"Failed to log in", status:xhr.status});
        }
      }
    };
    xhr.open('POST', 'https://fireboard.io/api/rest-auth/login/');
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ username: username, password: password })); 
  });
}

function storeToken(token) {
  return new Promise( (resolve,reject) => {
    sessionStorage.setItem('token',token);
    resolve(token);
  });
}

function storeUUID(uuid) {
  return new Promise( (resolve,reject) => {
    sessionStorage.setItem('uuid',uuid);
    resolve(uuid);
  });
}

function getFirstDevice() {
  return new Promise ( (resolve, reject) => {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if(xhr.readyState === XMLHttpRequest.DONE) {
        if(xhr.status === 200) {
          let json = JSON.parse(xhr.responseText);
          if( json.length < 1 ) {
            reject({desc: "No devices"})
          } else {
            resolve(json[0].uuid)
          }
        } else {
          reject({desc:"Failed to get First Device",status:xhr.status});
        }
      }
    };
    xhr.open('GET', 'https://fireboard.io/api/v1/devices.json');
    xhr.setRequestHeader('Authorization', 'Token ' + sessionStorage.getItem('token'));
    xhr.send(); 
  });
}

function getTemps(uuid) {
  return new Promise ( (resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if(xhr.readyState === XMLHttpRequest.DONE) {
        if(xhr.status === 200) {
          console.log("Temp Response: " + xhr.responseText);
          var channels = [];
          for( let i=0; i<6; i++ ) {
            channels[i] = new Channel(i);
          }
          let responses = JSON.parse(xhr.responseText);
          for( let i=0; i<responses.length; i++ ) {
            let response = responses[i];
            let channelId = response.channel;
            let channel = channels[channelId-1];
            channel.isConnected = true;
            channel.temp = response.temp*10; //we can only send int across the wire so this is in tenths of a degree.
            channel.unit = response.degreetype;
            channel.updatedAt = response.created;
          }
          resolve(channels);
        } else {
          reject({desc:"Failed to get temp for device " + uuid, status:xhr.status});
        }
      }
    };
    xhr.open('GET', 'https://fireboard.io/api/v1/devices/' + uuid + '/temps.json');
    xhr.setRequestHeader('Authorization', 'Token ' + sessionStorage.getItem('token'));
    xhr.send(); 
  });
}

module.exports.login = login;
module.exports.storeToken = storeToken;
module.exports.storeUUID = storeUUID;
module.exports.getFirstDevice = getFirstDevice;
module.exports.getTemps = getTemps;
