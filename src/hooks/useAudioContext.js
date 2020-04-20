import { useCallback, useState, useRef, useEffect } from 'react';
import { fileToArrayBuffer } from '../utils';

export default () => {
  const [audioContext, setAudioContext] = useState(null);
  const audioContextRef = useRef();

  const initAudioContext = useCallback(() => {
    const nextAudioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    setAudioContext(nextAudioContext);
    audioContextRef.current = nextAudioContext;
  }, []);

  const decodeAudioData = useCallback(
    async (file) => {
      if (!audioContext) initAudioContext();
      const ctx = audioContextRef.current;
      const audioData = await fileToArrayBuffer(file);
      // converts the array buffer to an audio buffer
      // also see: https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData
      const rawAudioBuffer = await ctx.decodeAudioData(audioData);
      // get the right and left channel and meta info from the audio buffer
      // see: https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer
      const left = rawAudioBuffer.getChannelData(0);
      const right = rawAudioBuffer.getChannelData(1);
      const meta = {
        duration: rawAudioBuffer.duration,
        length: rawAudioBuffer.length,
        sampleRate: rawAudioBuffer.sampleRate,
      };
      return [left, right, meta];
    },
    [audioContext, initAudioContext],
  );

  useEffect(() => {
    audioContextRef.current = audioContext;
  }, [audioContext]);

  return { audioContext, decodeAudioData };
};
