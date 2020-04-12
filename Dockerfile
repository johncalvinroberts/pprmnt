FROM trzeci/emscripten AS base

WORKDIR /
RUN apt-get update
RUN git clone https://github.com/Kagami/lame-svn.git
WORKDIR /lame-svn/lame
RUN emconfigure ./configure --disable-frontend --disable-decoder --disable-static --disable-analyzer-hooks --prefix=/lame-svn/lame/wdist
RUN emmake make -j8 && emmake make install
WORKDIR /src
