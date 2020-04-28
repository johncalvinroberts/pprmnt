# [pprmnt.cc](https://pprmnt.cc)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Netlify Status](https://api.netlify.com/api/v1/badges/f1cd5962-35b0-409a-8621-4cfca36bbdef/deploy-status)](https://app.netlify.com/sites/musing-yalow-be7560/deploys)

A secure MP3 encoder, powered by Web Assembly. [try it](https://pprmnt.cc)


![peppermint screenshot](https://user-images.githubusercontent.com/11850362/80461688-3eb6e880-8968-11ea-94b6-12c338a3ffdc.png)

## Why do we need this?

First, why do I need this: I'm a beatmaker, I make beats. When I send beats to other people, or upload them to [my website](https://damachabeats.com), I need to first convert them to MP3. The lossless WAV version that my DAW spits out is way too big to send easily, and also causes performance issues when uploading online.

Secondly, why might other people need this: Musicians are often in a similar situation, needing to send a quick MP3 instead of a huge WAV file. Musicians often seek out easy-to-use online "convert to MP3 online" websites -- websites which **require upload to a remote server**. They perform the MP3 encoding on the backend, not on the client. 

Basically: musicians are exposing their private intellectual property to these seedy websites, just to get an MP3 version of their audio. 

I thought some musicians might prefer a tool that converts their audio securely, locally on their machine, without exposing it to a sketchy third-party server.

## How does it work?

The underlying tech stack is based on the following:
* [`liblamemp3`](https://lame.sourceforge.io/), a classic C library for encoding audio to MP3
* [`emscripten`](https://emscripten.org/) is used to compile `liblamemp3` and C code to Web Assembly.
* [Web Assembly](https://developer.mozilla.org/en-US/docs/WebAssembly) runs native code on the client, allowing us to do memory-heavy stuff in the browser.
* All the emscripten web assembly action is done in Docker, for better portability and C lang dependency management.
* Frontend offloads the web assembly operations to [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) for better performance.
* Frontend built with React, Emotion, and Parcel Bundler

By default, **pprmnt** converts the source audio file to 320kbps MP3 using lame's `lame_encode_buffer_ieee_float` method.

## What else can it do?

Not very much.

But -- **pprmnt** is a [progressive web app](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps),so it works offline, and you can install it kind of like a desktop app.

## Why is it called "pprmnt"?

It's a cool way to spell "peppermint". 

## Development
### Known issues
* Would really appreciate code review by someone more familiar with WASM, help me.
* Firefox chokes when decoding some wav files, also [noted by other users on Stack Overflow](https://stackoverflow.com/questions/26169678/why-certain-wav-files-cannot-be-decoded-in-firefox).
* Queue'ing -- currently, if the user attempts encode a lot of MP3s concurrently, the app will go completely overboard with memory usage. A queue to control the maximum number or size of concurrently encoding "jobs" could help alleviate this.
* Performance -- current state is not optimized for speed, I just wanted to get this thing working. There are lots of areas for improvement. Currently, the slowest operation is [`BaseAudioContext.decodeAudioData()`](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData).

### Forthcoming features
* Transcoder options (bitrate, vbr, etc.)
* Support for other audio codecs as encoding target. Currently, decoding should be working with a variety of source formats, not just wav. It's `conver to x format` that will be a bit more difficult.
* Tray app
* Convert to [preact](https://preactjs.com/guide/v10/hooks) + [framework agnostic emotion](https://www.notion.so/johnnynchyah/pprmnt-todo-a585e4c4c3da463fa351a44f8374aa44#29063fd25ec743ab88d1374fe20d853f) for lighter bundle size. Currently, it's a 120+ kb chad bundle pretending to be a minimalist hipster bundle.

### Contributing
If you want to contribute, here's how to get the dev workflow running locally...

#### Prerequisites
* yarn v1.0.0 or higher
* docker
* GNU make

#### Commands
* `make install` - install docker deps and frontend deps
* `make build-docker` - builds the docker image, the environment for emscripten to run in, compiles `liblamemp3`
* `make build-wasm` - compiles the web assembly + javascript wrapper
* `yarn start` - run the dev server, open `http://localhost:1234/` to see the app running
* `yarn build` - build and prerender for prod deployment
