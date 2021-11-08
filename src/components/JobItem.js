/** @jsx jsx */
import { useEffect, useMemo } from 'react';
import { jsx, css } from '@emotion/core';
import hhmmss from 'hhmmss';
import { useEncoder } from '../hooks';
import { LOAD_STATUS } from '../constants';
import { useJobs } from './JobsContext';
import { Down } from './SVG';
import Button, { CloseButton } from './Button';
import Loader from './Loader';
import { truncateText, timer } from '../utils';
import Flex from './Flex';

const { INITIAL, PENDING, OK } = LOAD_STATUS;

const placeholder = css`
  background: var(--muted);
  height: 10px;
  width: 120px;
`;

const FileNameShow = ({ fileName }) => {
  const [name, ext] = useMemo(() => {
    const extIndex = fileName.lastIndexOf('.');
    const name = fileName.substring(0, extIndex);
    const ext = fileName.substring(extIndex);
    return [name, ext];
  }, [fileName]);

  return (
    <Flex>
      <div
        css={css`
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
        `}
      >
        {name}
      </div>
      <div>{ext}</div>
    </Flex>
  );
};

const JobItem = ({ id, file }) => {
  const { crumb } = timer(id);
  const { encode, error, loadStatus, download, trackData, encoded } =
    useEncoder(id);

  const { remove, finish, bitRate, vbrMethod } = useJobs();
  const { name: fileName } = file;

  const { meta } = trackData;
  const { duration } = meta;
  const handleRemove = () => remove(id);

  useEffect(() => {
    if (loadStatus === INITIAL) {
      crumb('Job Item defer to useEncoder');
      encode(file, bitRate, vbrMethod);
    }
  }, [bitRate, encode, file, loadStatus, vbrMethod]); //eslint-disable-line

  useEffect(() => {
    if (loadStatus === OK) {
      finish(id, encoded, trackData);
    }
  }, [loadStatus, id, encoded]); //eslint-disable-line

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
          display: block;
          max-width: 250px;
          white-space: nowrap;
        `}
      >
        {fileName ? (
          <FileNameShow fileName={fileName} />
        ) : (
          <div css={placeholder} />
        )}
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
