#!/bin/bash

set -e

# /lame-svn/lame/wdist/lib/libmp3lame.so peppermint.c
emcc \
  -I /lame-svn/lame/wdist/include \
  -DNDEBUG -Oz --llvm-lto 3 \
  -s WASM=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' \
  -s MODULARIZE=1 ./peppermint.c \
  -o artifacts/peppermint.js
