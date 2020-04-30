import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import useAudioContext from './useAudioContext';
import { MESSAGE_TYPES, LOAD_STATUS } from '../constants';
import { delay, forceDownload, stripFileExtension, logger } from '../utils';

const log = logger('useEncoder', 'aquamarine');

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
    log('received message');
    if (!data.type) return;
    switch (data.type) {
      case INIT:
        log('Encoder initialized');
        setIsEncoderReady(true);
        break;
      case FINISH_JOB:
        const { payload } = data;
        log('Received encoded binary from worker');
        log(data);
        log('Terminating worker', 'warn');
        workerRef.current.terminate();
        setLoadStatus(OK);
        setEncoded(payload);
        break;
      default:
        log('Unknown message received from worker');
        break;
    }
  }, []);

  // encode -- main function for sending the request to encode to the worker
  const encode = useCallback(
    async (rawFile, bitRate, vbr) => {
      if (error || !rawFile) {
        log('no file provided, bailing', 'warn');
        return;
      }

      setLoadStatus(PENDING);
      if (!isEncoderReadyRef.current) {
        log(
          'encoder is initializing, waiting 200ms and calling recursively',
          'warn',
        );
        await delay(200);
        return encode(rawFile, bitRate, vbr);
      }

      try {
        const { name } = rawFile;
        const fileName = stripFileExtension(name);
        log(
          `Stripping file extension, original: ${name}, stripped: ${fileName}`,
        );
        const [left, right, meta] = await decodeAudioData(rawFile);
        const options = { bitRate, vbr };
        setTrackData({ meta, fileName });
        log({ meta, fileName, options });
        log('Posting PCM data and meta CREATE_JOB to worker');
        worker.postMessage({
          type: CREATE_JOB,
          payload: { left, right },
          meta,
          options,
        });
        log('Posted message');
      } catch (error) {
        log(error, 'error');
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
    // set workerRef
    workerRef.current = worker;
    // error handler -- define here, not as a useCallback
    const handleError = (error) => setError(error);
    // worker event handlers
    worker.onmessageerror = handleError;
    worker.onerror = handleError;
    worker.onmessage = handleMessage;

    return () => {
      log('Cleaning up');
      worker.postMessage({ type: CLEANUP });
      if (workerRef.current) {
        log('Terminating worker', 'warn');
        workerRef.current.terminate();
      }
    };
  }, [handleMessage, worker]);

  useEffect(() => {
    isEncoderReadyRef.current = isEncoderReady;
  }, [isEncoderReady]);

  useEffect(() => {
    if (error) {
      log(error, 'error');
      setLoadStatus(ERROR);
    }
  }, [error]);

  return { error, worker, encode, loadStatus, download, trackData };
};
