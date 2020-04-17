import { useMemo, useCallback } from 'react';

const initAudioCtx = () =>
  new (window.AudioContext || window.webkitAudioContext)();

export default () => {
  const audioContext = useMemo(initAudioCtx, []);

  const decodeAudioDataToUInt8Array = useCallback(
    async (file) => {
      const audioData = await file.arrayBuffer();
      const rawBuff = await audioContext.decodeAudioData(audioData);
      const uInt8Array = new Uint8Array(rawBuff);
      return uInt8Array;
    },
    [audioContext],
  );

  return { audioContext, decodeAudioDataToUInt8Array };
};
