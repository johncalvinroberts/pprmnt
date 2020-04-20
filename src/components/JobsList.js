/** @jsx jsx */
import { jsx } from 'theme-ui';
import { useJobs } from './JobsContext';

const JobsList = () => {
  const { jobs } = useJobs();
  if (!jobs.length) return null;
  return (
    <div sx={{ gridColumn: '2' }}>
      {jobs.map((item) => (
        <div key={item.id}>{item.id}</div>
      ))}
    </div>
  );
};

export default JobsList;
