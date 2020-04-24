/** @jsx jsx */
import { useDropzone } from 'react-dropzone';
import { jsx, css } from '@emotion/core';
import { Up, Color } from './SVG';
import { useJobs } from './JobsContext';
import Button from './Button';
import { logger } from '../utils';
import Flex from './Flex';
import { useTheme } from './Theme';

const log = logger('Header', 'aqua');

const UploadButton = () => {
  const { add } = useJobs();
  const onDrop = (acceptedFiles) => {
    log('adding files');
    add(acceptedFiles);
  };
  const { open, getInputProps } = useDropzone({ onDrop });
  return (
    <Button
      css={css`
        z-index: 99;
      `}
      title="Encode a file"
      onClick={open}
    >
      <Up /> <input {...getInputProps()} accept="audio/*" />
    </Button>
  );
};

const ColorButton = () => {
  const { toggleColorMode } = useTheme();
  return (
    <Button
      css={css`
        z-index: 99;
      `}
      title="Encode a file"
      onClick={toggleColorMode}
    >
      <Color />
    </Button>
  );
};

export default () => {
  return (
    <header
      css={css`
        background: var(--background);
        position: sticky;
        padding: var(--smol) var(--xlrg);
        padding-top: 0;
        grid-column: 1;
        top: 0;
        z-index: 99;
      `}
    >
      <Flex
        css={css`
          flex-wrap: wrap;
          justify-content: flex-start;
          font-size: var(--smol);
        `}
      >
        <UploadButton />
        <ColorButton />
      </Flex>
      <h1>ppprmnt.</h1>
      <h3>A secure mp3 encoder in your browser.</h3>
    </header>
  );
};
