import { useMemo, useCallback } from 'react';

const initAudioCtx = () =>
  new (window.AudioContext || window.webkitAudioContext)();

export default () => {
  const audioContext = useMemo(initAudioCtx, []);

  const decodeAudioData = useCallback(
    async (file) => {
      const audioData = await file.arrayBuffer();
      // converts the array buffer to an audio buffer
      // see: https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer
      // also see: https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData
      const rawAudioBuffer = await audioContext.decodeAudioData(audioData);
      const left = rawAudioBuffer.getChannelData(0);
      const right = rawAudioBuffer.getChannelData(1);
      const meta = {
        duration: rawAudioBuffer.duration,
        length: rawAudioBuffer.length,
        sampleRate: rawAudioBuffer.sampleRate,
      };
      return [left, right, meta];
    },
    [audioContext],
  );

  return { audioContext, decodeAudioData };
};
