/** @jsx jsx */

import { useDropzone } from 'react-dropzone';
import { jsx, css } from '@emotion/core';
import { Up, Color } from './SVG';
import { useJobs } from './JobsContext';
import Button, { ButtonBase } from './Button';
import Flex from './Flex';
import { useTheme } from './Theme';
import { logger } from '../utils';
import { BIT_RATE_CHOICES } from '../constants';

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
    <Button
      css={css`
        position: relative;
        height: 20px;
        ul {
          display: none;
        }

        &:hover {
          ul {
            display: block;
          }
        }
      `}
      title="toggle bitrate menu"
      aria-haspopup="true"
      id="bitrate-menu-control"
    >
      {bitRate} kbps
      <ul
        role="menu"
        css={css`
          padding: 0;
          position: absolute;
          background: var(--background);
          z-index: 99;
          top: 20px;
          left: 0px;
          list-style: none;
          box-shadow: 2px 2px 0px var(--muted);
        `}
      >
        {BIT_RATE_CHOICES.map((item) => (
          <ButtonBase
            Component="li"
            key={item}
            css={css`
              width: 200px;
              color: var(--text);
              text-align: left;
            `}
            role="menuitem"
            onClick={() => setBitRate(item)}
            onKeyDown={() => setBitRate(item)}
          >
            {item} kbps
          </ButtonBase>
        ))}
      </ul>
    </Button>
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
      </Flex>
      <h1>ppprmnt.</h1>
      <h3>A secure mp3 encoder in your browser.</h3>
    </header>
  );
};
