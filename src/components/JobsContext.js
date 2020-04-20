import React, { createContext, useState, useContext, useCallback } from 'react';
import { generateUuid } from '../utils';

const JobsContext = createContext();

export const useJobs = () => useContext(JobsContext);

const Jobs = ({ children }) => {
  const [jobs, setJobs] = useState([]);

  const add = useCallback(
    (files) => {
      const jobsToAdd = files.map((file) => {
        const id = generateUuid();
        return { id, file };
      });

      const nextJobs = [...jobs, ...jobsToAdd];
      setJobs(nextJobs);
    },
    [jobs],
  );

  const remove = useCallback(
    (id) => {
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
