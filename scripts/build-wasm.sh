#!/bin/bash
set -ev
cd modules
docker run --rm -v $(pwd):/src johncalvinroberts/emscripten-lame bash ./build.sh

