#pragma once

#include <pebble.h>

// temps are stored as ints and are in tenths of a degree,
// since fireboard stores one decimal point, 
// and pebble cannot do interop with floats
typedef struct {
	bool connected;
	int id;
	char *name;
	int lastTemp;
	int thisTemp;
	char *updatedAt;
} Channel;

char* printChannel(Channel *channel);