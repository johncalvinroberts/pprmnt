/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useDropzone } from 'react-dropzone';
import { useJobs } from './JobsContext';
import { logger } from '../utils';
import { Up } from './SVG';
import Flex from './Flex';

const log = logger('DropZone', 'deeppink');

const Placeholder = ({ isDragActive }) => (
  <Flex
    css={css`
      height: 100%;
      cursor: pointer;
      justify-content: flex-start;
      padding-left: var(--xlrg);
      padding-right: var(--xlrg);
    `}
  >
    <p>
      {!isDragActive &&
        'Drag and drop audio files, or click anywhere to select files'}
    </p>
  </Flex>
);

const DropZone = ({ children }) => {
  const { add, jobs } = useJobs();

  const isEmpty = jobs.length < 1;

  const onDrop = (acceptedFiles) => {
    log('adding files');
    add(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: !isEmpty,
  });

  return (
    <div {...getRootProps()}>
      {isEmpty && <Placeholder isDragActive={isDragActive} />}
      {children}
      <input {...getInputProps()} accept="audio/*" />
      {isDragActive && (
        <Flex
          css={css`
            background-color: var(--text);
            border: solid 1px;
            cursor: pointer;
            position: fixed;
            z-index: 999;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            opacity: 0.5;
          `}
        >
          <Flex
            css={css`
              color: var(--background);
              > svg {
                padding-right: var(--smol);
              }
            `}
          >
            <Up size={60} />
            drop to encode
          </Flex>
        </Flex>
      )}
    </div>
  );
};

export default DropZone;
