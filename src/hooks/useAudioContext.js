import { useMemo, useCallback } from 'react';

const initAudioCtx = () =>
  new (window.AudioContext || window.webkitAudioContext)();

export default () => {
  const audioContext = useMemo(initAudioCtx, []);

  const decodeAudioDataToUInt8Array = useCallback(
    async (file) => {
      const audioData = await file.arrayBuffer();
      // converts the array buffer to an audio buffer
      // see: https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer
      // also see: https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData
      const rawAudioBuffer = await audioContext.decodeAudioData(audioData);
      const uInt8Array = new Uint8Array(rawAudioBuffer);
      const meta = {
        duration: rawAudioBuffer.duration,
        length: rawAudioBuffer.length,
        sampleRate: rawAudioBuffer.sampleRate,
      };
      return [uInt8Array, meta];
    },
    [audioContext],
  );

  const decodeUint8ArrayToAudio = (data) => {
    // createBuffer -> nChannels, length, sampleRate
    // for samepleRate arg, use numSeconds * sampleRate
    // see: https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createBuffer
    const buffer = audioContext.createBuffer(2, 22050, 44100);
  };

  return { audioContext, decodeAudioDataToUInt8Array, decodeUint8ArrayToAudio };
};
