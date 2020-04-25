import React from 'react';
import JobsList from './JobsList';
import DropZone from './DropZone';
import { useHead } from '../hooks';

const descriptionContent = `Convert WAV or other audio format to MP3 securely in your browser.`;
const titleContent = `pprmnt - Encode mp3`;

export default () => {
  useHead({
    title: titleContent,
    meta: {
      description: {
        content: descriptionContent,
      },
      'og:title': { content: titleContent },
      'twitter:title': { content: titleContent },
      'twitter:text:title': {
        content: titleContent,
      },
      'twitter:description': {
        content: descriptionContent,
      },
      keywords: {
        content: 'converter, mp3, wav, transcode, encoder',
      },
    },
  });
  return (
    <DropZone>
      <JobsList />
    </DropZone>
  );
};
