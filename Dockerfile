FROM trzeci/emscripten AS base

RUN apt-get update
RUN apt-get install -y lame
