/** @jsx jsx */
import { forwardRef } from 'react';
import { css, jsx } from '@emotion/core';
import { useDropzone } from 'react-dropzone';
import { useJobs } from './JobsContext';
import { logger } from '../utils';
import Button from './Button';
import { Up } from './SVG';
import Flex from './Flex';
import { mq } from './Theme';

const log = logger('DropZone', 'deeppink');

const UPLOAD_BTN_ID = 'upload-btn';

const UploadButton = forwardRef((props, ref) => (
  <Button
    {...props}
    ref={ref}
    css={css`
      position: sticky;
      top: 86px;
      background: var(--background);
      z-index: 99;
      ${mq[0]} {
        top: 110px;
      }
    `}
    id={UPLOAD_BTN_ID}
  >
    <Up />{' '}
    <span
      css={css`
        padding-left: var(--smol);
      `}
    >
      Select files
    </span>
  </Button>
));

const Placeholder = ({ isDragActive }) => (
  <Flex
    css={css`
      height: 100%;
      cursor: pointer;
    `}
  >
    <p
      css={css`
        padding: var(--smol);
      `}
    >
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

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: !isEmpty,
  });

  return (
    <div {...getRootProps()}>
      {isEmpty && <Placeholder isDragActive={isDragActive} />}
      {!isEmpty && <UploadButton onClick={open} />}
      {children}
      <input {...getInputProps()} accept="audio/*" />
      {isDragActive && (
        <Flex
          css={css`
            background-color: var(--text);
            border: solid 1px;
            cursor: pointer;
            position: absolute;
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
