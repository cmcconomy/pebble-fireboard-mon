#pragma once

typedef struct {
	bool connected;
	int id;
	char *name;
	float lastTemp;
	float thisTemp;
} Channel;

char* printChannel(Channel *channel);