#include <pebble.h>
#include "channel.h"

char* printChannel(Channel* channel) {
	int intPart = (int) channel->lastTemp;
	int decPart = (int)(10.0*(channel->lastTemp - (float)intPart));

    int bufSize = sizeof("n: XXX.X");
	char* text = malloc(bufSize);
	if( channel->connected ) {
		snprintf(text, bufSize, "%d: %3d.%d", channel->id, intPart, decPart);
	} else {
		snprintf(text, bufSize, "%d:   -  ", channel->id);
	}

	return text;
}