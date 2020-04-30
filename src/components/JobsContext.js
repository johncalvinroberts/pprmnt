import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import { generateUuid, logger } from '../utils';
import { BIT_RATE_KEY, VBR_METHOD_KEY, VBR_CHOICES } from '../constants';

const log = logger('JobsContext', 'tomato');

const { VBR_METHOD_DEFAULT } = VBR_CHOICES;

const initialBitRate = localStorage.getItem(BIT_RATE_KEY) || 320;
const initialVbrMethod =
  localStorage.getItem(VBR_METHOD_KEY) || VBR_METHOD_DEFAULT.value;

const JobsContext = createContext();

export const useJobs = () => useContext(JobsContext);

const Jobs = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [bitRate, setBitRate] = useState(initialBitRate);
  const [vbrMethod, setVbrMethod] = useState(initialVbrMethod);

  useEffect(() => {
    localStorage.setItem(BIT_RATE_KEY, bitRate);
  }, [bitRate]);

  useEffect(() => {
    localStorage.setItem(VBR_METHOD_KEY, vbrMethod);
  }, [vbrMethod]);

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
    <JobsContext.Provider
      value={{
        jobs,
        add,
        remove,
        setBitRate,
        bitRate,
        vbrMethod,
        setVbrMethod,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};

export default Jobs;
