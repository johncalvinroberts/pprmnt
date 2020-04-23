/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useDropzone } from 'react-dropzone';
import { useJobs } from './JobsContext';
import { headerOuterRef } from './Header';
import { logger } from '../utils';

const log = logger('DropZone', 'deeppink');

const DropZone = () => {
  const { add } = useJobs();

  const onDrop = (acceptedFiles) => {
    log('adding files');
    add(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const headerHeight =
    headerOuterRef.current && headerOuterRef.current.clientHeight;

  return (
    <div
      css={css`
        position: sticky;
        padding: var(--smol) var(--xlrg) var(--smol) var(--xlrg);
        display: grid;
        grid-template-rows: 1fr auto;
        grid-column: 1;
        top: ${headerHeight || 172};
        max-height: calc(100vh - 130px);
        z-index: 99;
      `}
    >
      <div
        {...getRootProps()}
        css={css`
          display: flex;
          align-items: center;
          border-color: var(--muted);
          border: solid 1px;
          justify-content: center;
          cursor: pointer;
        `}
      >
        <input {...getInputProps()} accept="audio/*" />
        <p
          css={css`
            padding: var(--smol);
            text-align: center;
          `}
        >
          {isDragActive
            ? 'Drop the files here ..'
            : 'Drag and drop audio files here, or click anywhere to select files'}
        </p>
      </div>
      <footer
        css={css`
          height: 40px;
          display: flex;
          justify-content: flex-start;
        `}
      >
        <span
          css={css`
            font-size: var(--smol);
            padding: var(--smol);
          `}
        >
          © {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
};

export default DropZone;
