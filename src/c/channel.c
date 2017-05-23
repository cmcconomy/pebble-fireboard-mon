#include <pebble.h>
#include "channel.h"

char* printChannel(Channel* channel) {
	int intPart = channel->thisTemp/10;
	int decPart = channel->thisTemp - intPart*10;

    int bufSize = sizeof("n: XXX.X");
	char* text = malloc(bufSize);
	if( channel->connected ) {
		snprintf(text, bufSize, "%d: %3d.%d", channel->id, intPart, decPart);
	} else {
		snprintf(text, bufSize, "%d:   -  ", channel->id);
	}

	return text;
}