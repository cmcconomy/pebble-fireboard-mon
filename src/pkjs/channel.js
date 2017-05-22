"use strict";

// used to access array-style message-keys
var keys = require('message_keys');

class Channel {
	// id is the channel number (0-indexed)
	constructor(id) {
		this.id = id;
		this.isConnected = false;
		this.temp = 0;
		this.unit = Channel.TEMP_UNIT.FAHRENHEIT;
		this.name = "";
		this.updatedAt = null;
	}
}

Channel.TEMP_UNIT = {CELCIUS:1, FAHRENHEIT:2};

exports = Channel;