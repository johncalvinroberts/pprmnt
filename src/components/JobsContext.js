import React, { createContext, useState, useContext, useCallback } from 'react';
import { generateUuid, logger } from '../utils';

const log = logger('JobsContext', 'tomato');

const JobsContext = createContext();

export const useJobs = () => useContext(JobsContext);

const Jobs = ({ children }) => {
  const [jobs, setJobs] = useState([]);

  const add = useCallback(
    (files) => {
      log('adding jobs');
      const jobsToAdd = files.map((file) => {
        const id = generateUuid();
        log(`adding job ${id}`);
        log(file);
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

  return (
    <JobsContext.Provider value={{ jobs, add, remove }}>
      {children}
    </JobsContext.Provider>
  );
};

export default Jobs;
