/** @jsx jsx */
import { jsx } from 'theme-ui';
import { useDropzone } from 'react-dropzone';
import { useJobs } from './JobsContext';
import { headerOuterRef } from './Header';

const PlaceToDropFiles = () => {
  const { add } = useJobs();

  const onDrop = (acceptedFiles) => {
    add(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const headerHeight =
    headerOuterRef.current && headerOuterRef.current.clientHeight;

  return (
    <div
      sx={{
        position: 'sticky',
        px: 4,
        py: 1,
        display: 'grid',
        gridTemplateRows: '1fr auto',
        gridColumn: '1',
        top: headerHeight,
        maxHeight: `calc(100vh - ${headerHeight}px)`,
      }}
    >
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
        <p sx={{ p: [4, 0], textAlign: ['center', 'inherit'] }}>
          {isDragActive
            ? 'Drop the files here ..'
            : 'Drag and drop audio files here, or click anywhere to select files'}
        </p>
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
