/** @jsx jsx */
import { jsx, Styled } from 'theme-ui';
import { useDropzone } from 'react-dropzone';
import { useJobs } from './JobsContext';

const PlaceToDropFiles = () => {
  const { add } = useJobs();

  const onDrop = (acceptedFiles) => {
    add(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div
      sx={{
        minHeight: '100vh',
        position: 'sticky',
        px: 4,
        py: 1,

        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        gridColumn: '1',
      }}
    >
      <header>
        <Styled.h1>peppermint.</Styled.h1>
        <h3>A simple, secure mp3 encoder in your browser.</h3>
      </header>
      <div
        {...getRootProps()}
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderColor: 'muted',
          border: 'solid 1px',
          justifyContent: 'center',
          cursor: 'pointer',
          bg: isDragActive ? 'highlight' : '',
          ':hover': {
            color: 'primary',
          },
        }}
      >
        <input {...getInputProps()} accept="audio/*" />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>
            Drag and drop audio files here, or click anywhere to select files
          </p>
        )}
      </div>
      <footer
        sx={{
          height: '40px',
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <span sx={{ fontSize: 1, py: 2 }}>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
};

export default PlaceToDropFiles;
