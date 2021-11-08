import forceDownload from './forceDownload';

export default (encoded, fileName) => {
  const blob = new Blob([encoded], { type: 'audio/mpeg' });
  forceDownload({ blob, fileName, ext: '.mp3' });
};
