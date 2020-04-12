#!/bin/bash

set -e

emcc -I /lame-svn/lame/wdist/include -s WASM=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' -s MODULARIZE=1 ./fib.c -o artifacts/fib.js
