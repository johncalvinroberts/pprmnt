import { MESSAGE_TYPES } from './constants';

importScripts('peppermint.js');

const { CREATE_JOB, CLEANUP, FINISH_JOB } = MESSAGE_TYPES;

const state = {
  encoder: null,
  samplesPointer: null,
  encodedPointer: null,
  samples: null,
  encoded: null,
  data: null,
  dataLength: 0,
};

const channels = 2;
const bitRate = 64; // up to 320 kbps
const sampleRate = 44100;
const numSamples = 4096;

const Instance = Module();

Instance.onRuntimeInitialized = () => {
  init();
};

function init() {
  const maxDuration = 60 * 60; // 1 hr
  const dataSize = (bitRate / 8) * 1024 * maxDuration * 1.25; // enough space for maxDuration seconds recording

  state.data = new Uint8Array(dataSize);
  state.encoder = Instance._encoder_create(sampleRate, channels, bitRate);
  state.samplesPointer = Instance._malloc(numSamples * 4);
  state.samples = new Float32Array(
    Instance.HEAPF32.buffer,
    state.samplesPointer,
  );
  state.encodedPointer = Instance._malloc(1.25 * numSamples + 7200);
  state.encoded = new Uint8Array(Instance.HEAPF32.buffer, state.encodedPointer);

  postMessage({ type: 'INIT' });
}

function encode(payload) {
  const nsamples = payload.length;
  state.samples.set(payload);
  const ret = Instance._encoder_encode(
    state.encoder,
    state.samplesPointer,
    state.samplesPointer,
    nsamples,
    state.encodedPointer,
    state.encoded.length,
  );

  if (ret > 0) {
    state.data.set(
      new Uint8Array(Module.HEAP8.buffer, state.encodedPointer, ret),
      state.dataLength,
    );
    state.dataLength += ret;
  }

  const result = Instance._encoder_flush(
    state.encoder,
    state.encodedPointer,
    state.encoded.length,
  );

  if (result > 0) {
    state.data.set(
      new Uint8Array(Module.HEAP8.buffer, state.encodedPointer, result),
      state.dataLength,
    );
    state.data_len += ret;
  }

  const mp3 = state.data.subarray(0, state.dataLength);

  postMessage({ type: FINISH_JOB, payload: mp3 }, [mp3.buffer]);
}

function cleanup() {
  Module._encoder_destroy(state.encoder);
  Module._free(state.samplesPointer);
  Module._free(state.encodedPointer);
  state.data = null;
  state.dataLength = 0;
  state.initialized = false;
}

onmessage = ({ data }) => {
  const { type, payload } = data;
  switch (type) {
    case CREATE_JOB:
      encode(payload);
      break;
    case CLEANUP:
      cleanup();
      break;

    default:
      break;
  }
};
