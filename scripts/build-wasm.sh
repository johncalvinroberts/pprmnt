#!/bin/bash
set -ev
cd modules
docker run --rm -v $(pwd):/src trzeci/emscripten bash ./build.sh

