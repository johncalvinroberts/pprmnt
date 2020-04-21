/** @jsx jsx */
import { useEffect } from 'react';
import { jsx, Spinner, Close } from 'theme-ui';
import { motion, AnimatePresence } from 'framer-motion';
import hhmmss from 'hhmmss';
import { useEncoder } from '../hooks';
import { LOAD_STATUS } from '../constants';
import { useJobs } from './JobsContext';
import { Down } from './SVG';
import Button from './Button';
import { truncateText } from '../utils';

const { INITIAL, PENDING, OK } = LOAD_STATUS;

const FileNameAnimate = ({ children }) => (
  <AnimatePresence>
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{
        opacity: { duration: 0.2 },
      }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

const FileNamePlaceholder = () => (
  <FileNameAnimate>
    <div
      sx={{
        bg: 'highlight',
        height: '10px',
        borderRadius: '2px',
        width: '120px',
      }}
    />
  </FileNameAnimate>
);

const FileName = ({ children }) => (
  <FileNameAnimate>
    <div
      sx={{
        pl: 1,
        maxWidth: ['120px', '240px', '300px'],
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  </FileNameAnimate>
);

const AnimateIn = ({ isVisible, children }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          scale: { type: 'spring', stiffness: 300, damping: 200 },
          opacity: { duration: 0.2 },
        }}
        exit={{ opacity: 0, scale: 0 }}
        sx={{ pl: 2 }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

const JobItem = ({ id, file }) => {
  const { encode, error, loadStatus, download, trackData } = useEncoder();

  const { remove } = useJobs();

  const { fileName, meta } = trackData;
  const { duration } = meta;
  const handleRemove = () => remove(id);

  useEffect(() => {
    if (loadStatus === INITIAL) encode(file);
  }, [encode, file, loadStatus]);

  return (
    <div
      sx={{
        py: 3,
        px: 2,
        pr: 4,
        maxWidth: '600px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        '&:hover': {
          bg: 'muted',
        },
      }}
    >
      <div sx={{ px: 1 }}>{hhmmss(duration)} - </div>
      <div>
        {!fileName ? <FileNamePlaceholder /> : <FileName>{fileName}</FileName>}
      </div>
      <div sx={{ display: 'flex', flex: '1', justifyContent: 'flex-end' }}>
        <AnimateIn isVisible={loadStatus === PENDING}>
          <Spinner size={32} />
        </AnimateIn>
        <AnimateIn isVisible={loadStatus === OK}>
          <Button onClick={download} title="download">
            <Down /> <span sx={{ pl: 2 }}>Download</span>
          </Button>
        </AnimateIn>
        <span sx={{ pl: 2 }}>
          <Close
            onClick={handleRemove}
            sx={{
              cursor: 'pointer',
              borderRadius: '0',
              '&:hover': { bg: 'highlight' },
              ':focus': {
                outline: 0,
                boxShadow: '0 0 0 2px',
              },
            }}
          />
        </span>
      </div>

      {error && (
        <div sx={{ bg: 'error', flex: '0 0 100%' }}>
          {truncateText(error.message) ||
            'Failed to encode this audio file, for some reason 🥴'}
        </div>
      )}
    </div>
  );
};

export default JobItem;
