#!/bin/bash

set -e


emcc ./peppermint.c \
  -s WASM=1 -O2 \
  -I /lame/dist/include \
  -i /lame/dist/lib/libmp3lame.so \
	-s ASSERTIONS=0 \
	-s TOTAL_STACK=65536 \
	-s TOTAL_MEMORY=2097152 \
	-s EXPORTED_FUNCTIONS="['_malloc', '_free']" \
  -s MODULARIZE=1 \
  -o artifacts/peppermint.js
