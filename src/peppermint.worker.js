import { MESSAGE_TYPES } from './constants';

importScripts('peppermint.js');

const { CREATE_JOB, CLEANUP, FINISH_JOB, INIT } = MESSAGE_TYPES;

const channels = 2;
const bitRate = 320; // up to 320 kbps

// need to instantiate global wasm "Module"
const Instance = Module();

// let main thread know when init'd
Instance.onRuntimeInitialized = () => {
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
  throw new Error('Encoding MP3 failed');
}

function buildMp3(payload, meta) {
  // sample rate, length passed from audio context meta
  const { sampleRate, length: nsamples } = meta;
  const { left, right } = payload;
  // initialize encoder
  const encoder = Instance._encoder_create(sampleRate, channels, bitRate);
  /**
   * according to lame api --
   *
   * mp3buffer_size (in bytes) = 1.25*num_samples + 7200.
   *
   * so we allocate the encoded pointer to this size
   */
  const codedPtr = Instance._malloc(1.25 * nsamples + 7200);

  // additionally, we allocate pointers for both left and right channels
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
  // encode
  const [data, length] = encode(
    encoder,
    samplesLeftPtr,
    samplesRightPtr,
    nsamples,
    codedPtr,
    coded,
  );

  const mp3 = data.subarray(0, length);

  /**
   * return value is an int
   *
   * if greater than 0, that means success
   *
   * return code will be number of bytes output in mp3buffer.
   */

  postMessage({ type: FINISH_JOB, payload: mp3 }, [mp3.buffer]);
  cleanup(encoder, samplesLeftPtr, samplesRightPtr, codedPtr);
}

function cleanup(encoder, samplesLeftPtr, samplesRightPtr, codedPtr) {
  Instance._encoder_destroy(encoder);
  Instance._free(samplesLeftPtr);
  Instance._free(samplesRightPtr);
  Instance._free(codedPtr);
}

onmessage = ({ data }) => {
  const { type, payload, meta } = data;
  switch (type) {
    case CREATE_JOB:
      buildMp3(payload, meta);
      break;
    case CLEANUP:
      cleanup();
      break;

    default:
      break;
  }
};
