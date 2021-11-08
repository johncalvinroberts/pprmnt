/** @jsx jsx */
import { useCallback } from 'react';
import { jsx, css } from '@emotion/core';
import Button from './Button';
import { Down } from './SVG';
import { useJobs } from './JobsContext';
import { createMp3Download } from '../utils';

const BatchDownloadButton = () => {
  const { jobs } = useJobs();

  const handleBatchDownload = useCallback(() => {
    // eslint-disable-next-line
    for (const job of jobs) {
      const { trackData, encoded } = job;
      createMp3Download(encoded, trackData.fileName);
    }
  }, [jobs]);

  return (
    <div
      css={css`
        padding: var(--smol);
        max-width: 600px; /* should be unset on mobile */
      `}
    >
      <Button
        onClick={handleBatchDownload}
        css={css`
          background-color: var(--text);
          color: var(--background);
          opacity: 0.5;
          width: 100%;
          &:hover {
            opacity: 0.8;
          }
        `}
      >
        <Down />{' '}
        <span
          css={css`
            padding-left: var(--smol);
          `}
        >
          Download All
        </span>
      </Button>
    </div>
  );
};

export default BatchDownloadButton;
