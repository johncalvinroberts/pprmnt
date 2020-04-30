/** @jsx jsx */

import { useDropzone } from 'react-dropzone';
import { jsx, css } from '@emotion/core';
import { Up, Color } from './SVG';
import { useJobs } from './JobsContext';
import Button from './Button';
import Flex from './Flex';
import Dropdown from './Dropdown';
import { useTheme } from './Theme';
import { logger } from '../utils';
import { BIT_RATE_CHOICES, VBR_CHOICES } from '../constants';

const bitRateChoices = BIT_RATE_CHOICES.map((item) => ({
  label: `${item} kbps`,
  value: item,
}));

const vbrMethodChoices = Object.keys(VBR_CHOICES).map(
  (key) => VBR_CHOICES[key],
);

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
        padding-top: 0;
        padding-bottom: 0;
      `}
      title="Encode a file"
      onClick={open}
    >
      <Up size={20} /> <input {...getInputProps()} accept="audio/*" />
    </Button>
  );
};

const ColorButton = () => {
  const { toggleColorMode } = useTheme();
  return (
    <Button
      css={css`
        z-index: 99;
        padding-top: 0;
        padding-bottom: 0;
      `}
      title="Encode a file"
      onClick={toggleColorMode}
    >
      <Color size={20} />
    </Button>
  );
};

const BitRateSelector = () => {
  const { bitRate, setBitRate } = useJobs();

  return (
    <Dropdown
      title="toggle bitrate menu"
      id="bitrate-menu-control"
      label={`${bitRate} kbps`}
      handleSelect={setBitRate}
      choices={bitRateChoices}
    />
  );
};

const VbrMethodSelector = () => {
  const { vbrMethod, setVbrMethod } = useJobs();
  const { label } = vbrMethodChoices[vbrMethod];
  return (
    <Dropdown
      id="vbr-method-control"
      title="toggle VBR method menu"
      label={label}
      handleSelect={setVbrMethod}
      choices={vbrMethodChoices}
    />
  );
};

export default () => {
  return (
    <header
      css={css`
        background: var(--background);
        position: sticky;
        padding-left: var(--xlrg);
        padding-right: var(--xlrg);
        padding-bottom: var(--smol);
        padding-top: 2px;
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
        <BitRateSelector />
        <VbrMethodSelector />
      </Flex>
      <h1>ppprmnt.</h1>
      <h3>A secure mp3 encoder in your browser.</h3>
    </header>
  );
};
