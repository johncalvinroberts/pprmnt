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
  const [trackData, setTrackData] = useState({ fileName: '', meta: {} });
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
        workerRef.current.terminate();
        setLoadStatus(OK);
        setEncoded(payload);
        break;
      default:
        break;
    }
  }, []);

  const encode = useCallback(
    async (rawFile) => {
      if (error || !rawFile) {
        return;
      }

      setLoadStatus(PENDING);
      if (!isEncoderReadyRef.current) {
        await delay(200);

        return encode(rawFile);
      }

      try {
        const { name } = rawFile;
        const fileName = stripFileExtension(name);
        const [left, right, meta] = await decodeAudioData(rawFile);

        setTrackData({ meta, fileName });
        worker.postMessage({
          type: CREATE_JOB,
          payload: { left, right },
          meta,
        });
      } catch (error) {
        setError(error);
      }
    },
    [decodeAudioData, error, worker],
  );

  const download = useCallback(() => {
    if (!encoded) return;
    const { fileName } = trackData;
    const blob = new Blob([encoded], { type: 'audio/mpeg' });
    forceDownload({ blob, fileName, ext: '.mp3' });
  }, [encoded, trackData]);

  // effects
  useEffect(() => {
    const handleError = (error) => setError(error);

    workerRef.current = worker;
    worker.onmessageerror = handleError;

    worker.onerror = handleError;

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
    if (error) setLoadStatus(ERROR);
  }, [error]);

  return { error, worker, encode, loadStatus, download, trackData };
};
