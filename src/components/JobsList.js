/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useJobs } from './JobsContext';
import JobItem from './JobItem';
import BatchDownloadButton from './BatchDownloadButton';

const JobsList = () => {
  const { jobs } = useJobs();
  if (!jobs.length) return null;
  return (
    <div>
      {jobs.map((item) => (
        <JobItem id={item.id} file={item.file} key={item.id} />
      ))}
      <BatchDownloadButton />
    </div>
  );
};

export default JobsList;
