import React, { createContext, useState, useContext, useCallback } from 'react';
import { generateUuid, logger, timer } from '../utils';
import { BIT_RATE_KEY, VBR_METHOD_KEY, VBR_CHOICES } from '../constants';
import { usePersistentState } from '../hooks';

const log = logger('JobsContext', 'tomato');

const { VBR_METHOD_DEFAULT } = VBR_CHOICES;
const DEFAULT_BIT_RATE = 320;
const DEFAULT_VBR_METHOD = VBR_METHOD_DEFAULT.value;

const JobsContext = createContext();

export const useJobs = () => useContext(JobsContext);

const Jobs = ({ children }) => {
  const [jobs, setJobs] = useState([]);

  // stored in localstorage
  const [bitRate, setBitRate] = usePersistentState(
    BIT_RATE_KEY,
    DEFAULT_BIT_RATE,
  );

  // stored in localstorage
  const [vbrMethod, setVbrMethod] = usePersistentState(
    VBR_METHOD_KEY,
    DEFAULT_VBR_METHOD,
  );

  const add = useCallback(
    (files) => {
      log('adding jobs');
      const jobsToAdd = files.map((file) => {
        const id = generateUuid();
        log(`adding job ${id}`);
        log(file);
        const { start } = timer(id);
        start();
        return { id, file };
      });

      const nextJobs = [...jobs, ...jobsToAdd];
      setJobs(nextJobs);
    },
    [jobs],
  );

  const remove = useCallback(
    (id) => {
      log(`removing job ${id}`);
      const nextJobs = jobs.filter((item) => item.id !== id);
      setJobs(nextJobs);
    },
    [jobs],
  );

  const finish = useCallback(
    (id, encoded, trackData) => {
      const nextJobs = jobs.map((item) => {
        if (item.id === id) {
          return { ...item, trackData, encoded };
        }
        return item;
      });
      setJobs(nextJobs);
    },
    [setJobs, jobs],
  );

  return (
    <JobsContext.Provider
      value={{
        jobs,
        add,
        remove,
        setBitRate,
        bitRate,
        vbrMethod,
        setVbrMethod,
        finish,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};

export default Jobs;
