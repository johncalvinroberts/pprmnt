import { useMemo, useCallback } from 'react';
import ID3Writer from 'browser-id3-writer';
import { parse } from 'id3-parser';
import { SUPPORTED_TAGS, FRAME_TYPES } from '../constants';
import { isString, isObject, isNumber, typedArrayToBuffer } from '../utils';

const validateTag = (tag, value) => {
  const expectedType = SUPPORTED_TAGS[tag];

  if (!expectedType) return false;

  switch (expectedType) {
    case 'array':
      return Array.isArray(value);
    case 'object':
      return isObject(value);
    case 'string':
      return isString(value);
    case 'integer':
      return isNumber(value);
    default:
      break;
  }
};

const writeTagsAndGetBlob = async (uInt8Array, tags) => {
  const buff = typedArrayToBuffer(uInt8Array);
  let ret;
  try {
    const writer = new ID3Writer(buff);

    // eslint-disable-next-line no-restricted-syntax, prefer-const
    for (let [key, value] of Object.entries(tags)) {
      const tag = FRAME_TYPES[key];
      const isValid = validateTag(tag, value);
      if (isValid) {
        try {
          writer.setFrame(tag, value);
        } catch (error) {
          console.debug(error);
        }
      }
    }
    writer.addTag();
    ret = writer.getBlob();
  } catch (error) {
    ret = new Blob([uInt8Array], { type: 'audio/mpeg' });
  }
  return ret;
};

const readTags = async (buff) => {
  let tags;
  try {
    tags = parse(new Uint8Array(buff));
  } catch (error) {
    tags = {};
  }

  return tags;
};

const initAudioCtx = () =>
  new (window.AudioContext || window.webkitAudioContext)();

export default () => {
  const audioContext = useMemo(initAudioCtx, []);

  const decodeAudioData = useCallback(
    async (file) => {
      const audioData = await file.arrayBuffer();
      const tags = await readTags(audioData);
      // converts the array buffer to an audio buffer
      // also see: https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData
      const rawAudioBuffer = await audioContext.decodeAudioData(audioData);
      // get the right and left channel and meta info from the audio buffer
      // see: https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer
      const left = rawAudioBuffer.getChannelData(0);
      const right = rawAudioBuffer.getChannelData(1);
      const meta = {
        duration: rawAudioBuffer.duration,
        length: rawAudioBuffer.length,
        sampleRate: rawAudioBuffer.sampleRate,
      };
      return [left, right, meta, tags];
    },
    [audioContext],
  );

  const bundleAudioForDownload = useCallback(({ encoded, tags }) => {
    return writeTagsAndGetBlob(encoded, tags);
  }, []);

  return { audioContext, decodeAudioData, bundleAudioForDownload };
};
