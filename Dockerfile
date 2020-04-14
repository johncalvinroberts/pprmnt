FROM trzeci/emscripten-ubuntu AS base

WORKDIR /
RUN apt-get update
# RUN git clone https://github.com/Kagami/lame-svn.git
RUN wget http://jaist.dl.sourceforge.net/project/lame/lame/3.99/lame-3.99.5.tar.gz
RUN tar -xvf lame-3.99.5.tar.gz
#WORKDIR /lame-svn/lame
WORKDIR /lame-3.99.5

RUN emconfigure \
  ./configure \ 
  --prefix=/lame/dist \
  --disable-gtktest \ 
  --disable-analyzer-hooks \
  --disable-decoder \
  --disable-frontend 

RUN emmake make -j4 && emmake make install
WORKDIR /src
