import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import { generateUuid, logger } from '../utils';
import { BIT_RATE_KEY } from '../constants';

const log = logger('JobsContext', 'tomato');

const initialBitRate = localStorage.getItem(BIT_RATE_KEY) || 320;

const JobsContext = createContext();

export const useJobs = () => useContext(JobsContext);

const Jobs = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [bitRate, setBitRate] = useState(initialBitRate);

  useEffect(() => {
    localStorage.setItem(BIT_RATE_KEY, bitRate);
  }, [bitRate]);

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
    <JobsContext.Provider value={{ jobs, add, remove, setBitRate, bitRate }}>
      {children}
    </JobsContext.Provider>
  );
};

export default Jobs;
