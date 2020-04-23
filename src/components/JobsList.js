/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useJobs } from './JobsContext';
import JobItem from './JobItem';

const JobsList = () => {
  const { jobs } = useJobs();
  if (!jobs.length) return null;
  return (
    <div
      css={css`
        grid-column: 2;
        /* should be 1/ span 2 on mobile */
      `}
    >
      {jobs.map((item) => (
        <JobItem id={item.id} file={item.file} key={item.id} />
      ))}
    </div>
  );
};

export default JobsList;
