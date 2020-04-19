import { useMemo, useCallback } from 'react';
import MP3Tag from 'mp3tag.js';

const readTags = async (buff) => {
  let tags;
  try {
    const mp3tag = new MP3Tag(buff);
    const tagger = mp3tag.read();
    if (tagger.name === 'ID3v2') {
      tags = tagger.getFrames();
    }
  } catch (error) {
    tags = {};
  }

  return tags;
};

const writeTags = async (buff, tags) => {
  let ret;
  try {
    const mp3tag = new MP3Tag(buff);
    const tagger = mp3tag.read();
    console.log({ tags });
    // eslint-disable-next-line no-restricted-syntax
    for (const tag of tags) {
      tagger.addFrame(tag);
    }
    ret = tagger.getAudio();
  } catch (error) {
    ret = buff;
  }
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

  return { audioContext, decodeAudioData };
};
