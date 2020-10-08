import { MESSAGE_TYPES } from './constants';
import { logger } from './utils';

// config
const { CREATE_JOB, CLEANUP, FINISH_JOB, INIT } = MESSAGE_TYPES;

// set up the worker
const log = logger('peppermint.worker', 'springgreen');
log('worker mounted');

// import the wasm + emscripten wrapper
importScripts('peppermint.js');

// need to instantiate global wasm "Module"
const Instance = Module();

// let main thread know when init'd
Instance.onRuntimeInitialized = () => {
  log('Worker Initialized');
  postMessage({ type: INIT });
};

function encode(
  encoder,
  samplesLeftPtr,
  samplesRightPtr,
  nsamples,
  codedPtr,
  coded,
) {
  log('Encoding...');
  const ret = Instance._eencode(
    encoder,
    samplesLeftPtr,
    samplesRightPtr,
    nsamples,
    codedPtr,
    coded.length,
  );

  if (ret > 0) {
    const data = new Uint8Array(Instance.HEAP8.buffer, codedPtr, ret);
    return [data, ret];
  }
  log('Encoding failed', 'error');
  throw new Error('Encoding MP3 failed');
}

async function buildMp3(payload, meta, options) {
  log('buildMp3');
  try {
    // sample rate, length passed from audio context meta
    const { sampleRate, length: nsamples, numberOfChannels } = meta;
    const { left, right } = payload;
    const { bitRate, vbr } = options;

    // initialize en,coder
    log('Creating encoder');
    const encoder = Instance._encoder_create(
      sampleRate,
      numberOfChannels,
      bitRate,
      vbr,
    );
    log('Encoder created success');
    /**
     * according to lame api --
     *
     * mp3buffer_size (in bytes) = 1.25*num_samples + 7200.
     *
     * so we allocate the encoded pointer to this size
     */
    log('Allocating memory for left, right PCM data, and encoded');
    const codedPtr = Instance._malloc(1.25 * nsamples + 7200);

    // additionally, we allocate pointers for both left and right channels
    const samplesLeftPtr = Instance._malloc(nsamples * 4);
    const samplesRightPtr = Instance._malloc(nsamples * 4);

    const samplesLeft = new Float32Array(
      Instance.HEAPF32.buffer,
      samplesLeftPtr,
    );
    samplesLeft.set(left);

    const samplesRight = new Float32Array(
      Instance.HEAPF32.buffer,
      samplesRightPtr,
    );
    // right could be null, if it's mono
    if (right) {
      samplesRight.set(right);
    }

    const coded = new Uint8Array(Instance.HEAPF32.buffer, codedPtr);
    const [data, length] = encode(
      encoder,
      samplesLeftPtr,
      samplesRightPtr,
      nsamples,
      codedPtr,
      coded,
    );
    log('Encode success');
    log({ data, length });

    const mp3 = new Uint8Array(data.subarray(0, length));
    /**
     * return value is an int
     *
     * if greater than 0, that means success
     *
     * return code will be number of bytes output in mp3buffer.
     */
    log('Posting message with MP3 buffer back down to main thread');

    postMessage({ type: FINISH_JOB, payload: mp3 }, [mp3.buffer]);
    cleanup(encoder, samplesLeftPtr, samplesRightPtr, codedPtr);
  } catch (error) {
    log(error, 'error');
    throw new Error(error);
  }
}

function cleanup(encoder, samplesLeftPtr, samplesRightPtr, codedPtr) {
  log('Cleanup');
  Instance._encoder_destroy(encoder);
  Instance._free(samplesLeftPtr);
  Instance._free(samplesRightPtr);
  Instance._free(codedPtr);
  log('Cleanup success');
}

onmessage = ({ data }) => {
  log('Received message');
  log({ data });
  const { type, payload, meta, options } = data;
  switch (type) {
    case CREATE_JOB:
      log(options);
      buildMp3(payload, meta, options);
      break;
    case CLEANUP:
      cleanup();
      break;

    default:
      log('Unknown message received on worker');
      break;
  }
};
