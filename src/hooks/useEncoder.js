import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import useAudioContext from './useAudioContext';
import { MESSAGE_TYPES, LOAD_STATUS } from '../constants';
import { delay, forceDownload, stripFileExtension } from '../utils';

const { INIT, CREATE_JOB, FINISH_JOB, CLEANUP } = MESSAGE_TYPES;

const { INITIAL, PENDING, OK, ERROR } = LOAD_STATUS;

const createWorker = () => new Worker('../peppermint.worker.js');

export default () => {
  const [error, setError] = useState(null);
  const [isEncoderReady, setIsEncoderReady] = useState(false);
  const [encoded, setEncoded] = useState(null);
  const [trackData, setTrackData] = useState(null);
  const [loadStatus, setLoadStatus] = useState(INITIAL);
  const isEncoderReadyRef = useRef(false);

  const worker = useMemo(createWorker, []);

  const { decodeAudioData } = useAudioContext();

  const workerRef = useRef(null);

  const handleMessage = useCallback(({ data }) => {
    if (!data.type) return;
    switch (data.type) {
      case INIT:
        setIsEncoderReady(true);
        break;
      case FINISH_JOB:
        const { payload } = data;
        setLoadStatus(OK);
        setEncoded(payload);
        break;
      default:
        break;
    }
  }, []);

  const handleError = useCallback((error) => {
    setError(error);
    setLoadStatus(ERROR);
  }, []);

  const add = useCallback(
    async (rawFile) => {
      if (error) {
        return;
      }

      if (!rawFile || !rawFile[0]) {
        return;
      }

      setLoadStatus(PENDING);

      if (!isEncoderReady) {
        await delay(200);
        return add(rawFile);
      }

      try {
        const { name } = rawFile[0];
        const fileName = stripFileExtension(name);
        const [left, right, meta] = await decodeAudioData(rawFile[0]);
        setTrackData({ meta, fileName });
        worker.postMessage({
          type: CREATE_JOB,
          payload: { left, right },
          meta,
        });
      } catch (error) {
        handleError(error);
      }
    },
    [decodeAudioData, error, handleError, isEncoderReady, worker],
  );

  // effects
  useEffect(() => {
    workerRef.current = worker;
    worker.onmessageerror = handleError;

    worker.onerror = handleError;

    worker.onmessage = handleMessage;
    return () => {
      worker.postMessage({ type: CLEANUP });
      workerRef.current.terminate();
    };
  }, [handleError, handleMessage, worker]);

  useEffect(() => {
    isEncoderReadyRef.current = isEncoderReady;
  }, [isEncoderReady]);

  useEffect(() => {
    if (encoded) {
      const { fileName } = trackData;
      const blob = new Blob([encoded], { type: 'audio/mpeg' });
      forceDownload({ blob, fileName, ext: '.mp3' });
    }
  }, [encoded, trackData]);

  return { error, worker, add, loadStatus };
};
