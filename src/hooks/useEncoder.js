import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import useAudioContext from './useAudioContext';

import { MESSAGE_TYPES } from '../constants';
import { delay, forceDownload } from '../utils';

const { INIT, CREATE_JOB, FINISH_JOB, CLEANUP } = MESSAGE_TYPES;

const createWorker = () => new Worker('../peppermint.worker.js');

export default () => {
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [data, setData] = useState(null);
  const worker = useMemo(createWorker, []);

  const { decodeAudioData } = useAudioContext();

  const workerRef = useRef(null);

  const handleMessage = useCallback(({ data }) => {
    if (!data.type) return;
    switch (data.type) {
      case INIT:
        setIsReady(true);
        break;
      case FINISH_JOB:
        const { payload } = data;
        const blob = new Blob([payload], { type: 'audio/mpeg' });
        setData(blob);
        break;
      default:
        break;
    }
  }, []);

  const add = useCallback(
    async (rawFile) => {
      if (!isReady) {
        await delay(200);
        return add(rawFile);
      }

      if (error) {
        return;
      }

      if (!rawFile || !rawFile[0]) {
        return;
      }
      const [left, right, meta] = await decodeAudioData(rawFile[0]);

      worker.postMessage({ type: CREATE_JOB, payload: { left, right }, meta });
    },
    [decodeAudioData, error, isReady, worker],
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
    if (data) {
      forceDownload(data);
    }
  }, [data]);

  return { error, worker, add };
};
