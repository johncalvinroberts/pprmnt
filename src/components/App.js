/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useDropzone } from 'react-dropzone';
import useEncoder from '../hooks/useEncoder';

const App = () => {
  const { add } = useEncoder();

  const onDrop = (acceptedFiles) => {
    return add(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      css={css`
        display: flex;
        width: 100%;
      `}
      {...getRootProps()}
    >
      <input
        {...getInputProps()}
        accept="audio/*"
        css={css`
          flex: 1;
          padding: 32px;
        `}
      />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag n drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default App;
