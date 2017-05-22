#!/bin/bash

pebble clean && pebble build && pebble install --logs -vvvvv --phone=192.168.0.55
