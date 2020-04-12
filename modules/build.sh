#!/bin/bash

set -e
#apt-get update
#apt-get install -y lame

emcc -s WASM=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' -s MODULARIZE=1 ./fib.c -o fib.js
