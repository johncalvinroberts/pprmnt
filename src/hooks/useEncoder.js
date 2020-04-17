import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import useAudioContext from './useAudioContext';

import { MESSAGE_TYPES } from '../constants';
import { delay } from '../utils';

const { INIT, CREATE_JOB, FINISH_JOB, CLEANUP } = MESSAGE_TYPES;

const createWorker = () => new Worker('../peppermint.worker.js');

export default () => {
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [data, setData] = useState(null);
  const worker = useMemo(createWorker, []);

  const { decodeAudioDataToUInt8Array } = useAudioContext();

  const workerRef = useRef(null);

  const handleMessage = useCallback(({ data }) => {
    if (!data.type) return;
    switch (data.type) {
      case INIT:
        setIsReady(true);
        break;
      case FINISH_JOB:
        setData(data);
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
      const payload = await decodeAudioDataToUInt8Array(rawFile[0]);

      worker.postMessage({ type: CREATE_JOB, payload });
    },
    [decodeAudioDataToUInt8Array, error, isReady, worker],
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

  return { error, worker, add };
};
