import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import useAudioContext from './useAudioContext';
import { MESSAGE_TYPES } from '../constants';
import { delay, forceDownload, stripFileExtension } from '../utils';

const { INIT, CREATE_JOB, FINISH_JOB, CLEANUP } = MESSAGE_TYPES;

const createWorker = () => new Worker('../peppermint.worker.js');

export default () => {
  const [error, setError] = useState(null);
  const [isEncoderReady, setIsEncoderReady] = useState(false);
  const [encoded, setEncoded] = useState(null);
  const [trackData, setTrackData] = useState(null);
  const isEncoderReadyRef = useRef(false);

  const worker = useMemo(createWorker, []);

  const { decodeAudioData, bundleAudioForDownload } = useAudioContext();

  const workerRef = useRef(null);

  const handleMessage = useCallback(({ data }) => {
    if (!data.type) return;
    switch (data.type) {
      case INIT:
        setIsEncoderReady(true);
        break;
      case FINISH_JOB:
        const { payload } = data;
        setEncoded(payload);
        break;
      default:
        break;
    }
  }, []);

  const add = useCallback(
    async (rawFile) => {
      if (!isEncoderReady) {
        await delay(200);
        return add(rawFile);
      }

      if (error) {
        return;
      }

      if (!rawFile || !rawFile[0]) {
        return;
      }
      const { name } = rawFile[0];
      const fileName = stripFileExtension(name);
      const [left, right, meta] = await decodeAudioData(rawFile[0]);
      setTrackData({ meta, fileName });
      worker.postMessage({
        type: CREATE_JOB,
        payload: { left, right },
        meta,
      });
    },
    [decodeAudioData, error, isEncoderReady, worker],
  );

  useEffect(() => {
    workerRef.current = worker;
    worker.onmessageerror = (error) => setError(error);

    worker.onerror = (error) => setError(error);

    worker.onmessage = handleMessage;
    return () => {
      worker.postMessage({ type: CLEANUP });
      workerRef.current.terminate();
    };
  }, [handleMessage, worker]);

  useEffect(() => {
    isEncoderReadyRef.current = isEncoderReady;
  }, [isEncoderReady]);

  useEffect(() => {
    const bundleAndDownload = async () => {
      const { fileName } = trackData;

      const blob = new Blob([encoded], { type: 'audio/mpeg' });
      forceDownload({ blob, fileName });
    };

    if (encoded) {
      bundleAndDownload();
    }
  }, [bundleAudioForDownload, encoded, trackData]);

  return { error, worker, add };
};
