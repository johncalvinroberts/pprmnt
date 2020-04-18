import { MESSAGE_TYPES } from './constants';

importScripts('peppermint.js');

const { CREATE_JOB, CLEANUP, FINISH_JOB } = MESSAGE_TYPES;

const state = {
  encoder: null,
  samplesPtr: null,
  codedPtr: null,
  coded: null,
};

const channels = 2;
const bitRate = 320; // up to 320 kbps

const Instance = Module();

Instance.onRuntimeInitialized = () => {
  init();
};

function init() {
  const maxDuration = 60 * 60;
  const dataSize = (bitRate / 8) * 1024 * maxDuration * 1.25; // enough space for maxDuration seconds recording
  state.data = new Uint8Array(dataSize);
  postMessage({ type: 'INIT' });
}

function encode(payload, meta) {
  const { sampleRate, length: nsamples } = meta;

  const { left, right } = payload;

  state.encoder = Instance._encoder_create(sampleRate, channels, bitRate);
  const codedPtr = Instance._malloc(1.25 * nsamples + 7200);

  const samplesLeftPtr = Instance._malloc(nsamples * 4);
  const samplesRightPtr = Instance._malloc(nsamples * 4);
  const samplesLeft = new Float32Array(Instance.HEAPF32.buffer, samplesLeftPtr);
  samplesLeft.set(left);
  const samplesRight = new Float32Array(
    Instance.HEAPF32.buffer,
    samplesRightPtr,
  );
  samplesRight.set(right);

  const coded = new Uint8Array(Instance.HEAPF32.buffer, codedPtr);

  const ret = Instance._eencode(
    state.encoder,
    samplesLeftPtr,
    samplesRightPtr,
    nsamples,
    codedPtr,
    coded.length,
  );

  const mp3 = new Uint8Array(Instance.HEAP8.buffer, codedPtr, ret);

  postMessage({ type: FINISH_JOB, payload: mp3 }, [mp3.buffer]);
}

function cleanup() {
  Instance._encoder_destroy(state.encoder);
  Instance._free(state.samplesPtr);
  Instance._free(state.codedPtr);
}

onmessage = ({ data }) => {
  const { type, payload, meta } = data;
  switch (type) {
    case CREATE_JOB:
      encode(payload, meta);
      break;
    case CLEANUP:
      cleanup();
      break;

    default:
      break;
  }
};
