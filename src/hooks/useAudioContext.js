import { useCallback, useState, useRef, useEffect } from 'react';
import { fileToArrayBuffer, logger } from '../utils';

const log = logger('useAudioContext', 'mediumpurple');

// callback  wrapper for the BaseAudioContext.decodeAudioData
// promise syntax not supported in safari
const decode = (ctx, audioData) => {
  return new Promise((resolve, reject) => {
    ctx.decodeAudioData(
      audioData,
      (buffer) => resolve(buffer),
      (error) => reject(error),
    );
  });
};

export default () => {
  const [audioContext, setAudioContext] = useState(null);
  const audioContextRef = useRef();

  const initAudioContext = useCallback(() => {
    log('init audio context');
    const nextAudioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    setAudioContext(nextAudioContext);
    audioContextRef.current = nextAudioContext;
  }, []);

  const decodeAudioData = useCallback(
    async (file) => {
      log('decode audio data');
      log(file);
      if (!audioContext) initAudioContext();
      const ctx = audioContextRef.current;
      const audioData = await fileToArrayBuffer(file);
      log(`Converted File to array buffer`);
      // converts the array buffer to an audio buffer
      // also see: https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData
      const rawAudioBuffer = await decode(ctx, audioData);
      const { numberOfChannels } = rawAudioBuffer;
      log(`Converted array buffer raw AudioBuffer`);
      // get the right and left channel and meta info from the audio buffer
      // see: https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer
      const left = rawAudioBuffer.getChannelData(0);
      const right =
        numberOfChannels > 1 ? rawAudioBuffer.getChannelData(1) : null;
      const meta = {
        duration: rawAudioBuffer.duration,
        length: rawAudioBuffer.length,
        sampleRate: rawAudioBuffer.sampleRate,
        numberOfChannels,
      };
      log(meta);
      return [left, right, meta];
    },
    [audioContext, initAudioContext],
  );

  useEffect(() => {
    audioContextRef.current = audioContext;
  }, [audioContext]);

  return { audioContext, decodeAudioData };
};
