/** @jsx jsx */
import { jsx } from 'theme-ui';
import { useJobs } from './JobsContext';
import JobItem from './JobItem';

const JobsList = () => {
  const { jobs } = useJobs();
  if (!jobs.length) return null;
  return (
    <div sx={{ gridColumn: ['1 / span 2', '1 / span 2', '2'] }}>
      {jobs.map((item) => (
        <JobItem id={item.id} file={item.file} key={item.id} />
      ))}
    </div>
  );
};

export default JobsList;
