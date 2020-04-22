/** @jsx jsx */
import { jsx } from 'theme-ui';
import { motion, AnimatePresence } from 'framer-motion';
import { useJobs } from './JobsContext';
import JobItem from './JobItem';

const JobsList = () => {
  const { jobs } = useJobs();
  if (!jobs.length) return null;
  return (
    <div sx={{ gridColumn: ['1 / span 2', '1 / span 2', '2'] }}>
      {jobs.map((item) => (
        <AnimatePresence key={item.id}>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: '100%' }}
            transition={{
              y: { type: 'spring', stiffness: 300, damping: 200 },
              opacity: { duration: 0.2 },
            }}
            exit={{ opacity: 0, y: '100%' }}
          >
            <JobItem id={item.id} file={item.file} />
          </motion.div>
        </AnimatePresence>
      ))}
    </div>
  );
};

export default JobsList;
