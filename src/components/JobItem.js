/** @jsx jsx */
import { useEffect } from 'react';
import { jsx, css } from '@emotion/core';
import hhmmss from 'hhmmss';
import { useEncoder } from '../hooks';
import { LOAD_STATUS } from '../constants';
import { useJobs } from './JobsContext';
import { Down } from './SVG';
import Button, { CloseButton } from './Button';
import Loader from './Loader';
import { truncateText } from '../utils';
import Flex from './Flex';

const { INITIAL, PENDING, OK } = LOAD_STATUS;

const placeholder = css`
  background: var(--muted);
  height: 10px;
  width: 120px;
`;

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
    <Flex
      css={css`
        padding: var(--smol);
        padding-right: var(--lrg);
        max-width: 600px; /* should be unset on mobile */
        flex-wrap: wrap;
        &:hover {
          background: var(--muted);
        }
      `}
    >
      <div
        css={css`
          padding: 0 var(--smol);
        `}
      >
        {hhmmss(duration)} -{' '}
      </div>
      <div
        css={css`
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
          max-width: 200px;
          white-space: nowrap;
        `}
      >
        {fileName || <div css={placeholder} />}
      </div>
      <Flex
        css={css`
          flex: 1;
          justify-content: flex-end;
        `}
      >
        {loadStatus === PENDING && (
          <Flex
            css={css`
              padding: 0 var(--med);
            `}
          >
            status: {loadStatus}{' '}
            <Loader
              css={css`
                padding-left: var(--smol);
              `}
            />
          </Flex>
        )}
        {loadStatus === OK && (
          <Button onClick={download} title="download">
            <Down />{' '}
            <span
              css={css`
                padding-left: var(--smol);
              `}
            >
              Download
            </span>
          </Button>
        )}
        <CloseButton
          onClick={handleRemove}
          css={css`
            padding-left: var(--smol);
          `}
        />
      </Flex>

      {error && (
        <div
          css={css`
            background: var(--error);
            flex: 0 0 100%;
          `}
        >
          {truncateText(error.message) ||
            'Failed to encode this audio file, for some reason 🥴'}
        </div>
      )}
    </Flex>
  );
};

export default JobItem;
