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
const bitRate = 64; // up to 320 kbps
const sampleRate = 44100;

const Instance = Module();

Instance.onRuntimeInitialized = () => {
  init();
};

function init() {
  state.encoder = Instance._encoder_create(sampleRate, channels, bitRate);
  const maxDuration = 60 * 60;
  const dataSize = (bitRate / 8) * 1024 * maxDuration * 1.25; // enough space for maxDuration seconds recording

  state.data = new Uint8Array(dataSize);
  postMessage({ type: 'INIT' });
}

function encode(payload) {
  const nsamples = payload.length;

  const samplesPtr = Instance._malloc(nsamples * 4);
  const codedPtr = Instance._malloc(1.25 * nsamples + 7200);
  const coded = new Uint8Array(Instance.HEAPF32.buffer, codedPtr);

  state.samplesPtr = samplesPtr;
  state.codedPtr = codedPtr;

  const ret = Instance._encoder_encode(
    state.encoder,
    samplesPtr,
    samplesPtr,
    nsamples,
    codedPtr,
    coded.length,
  );
  const data = new Uint8Array(Instance.HEAP8.buffer, codedPtr, ret);

  const mp3 = data.subarray(0, data.length);

  postMessage({ type: FINISH_JOB, payload: mp3 }, [mp3.buffer]);
}

function cleanup() {
  Instance._encoder_destroy(state.encoder);
  Instance._free(state.samplesPtr);
  Instance._free(state.codedPtr);
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
