/** @jsx jsx */
import { jsx } from '@emotion/core';
import Content from './Content';
import { useHead } from '../hooks';

const titleContent = `pprmnt - About`;
const descriptionContent = `About pprmnt, the secure mp3 converter in your browser with no third party upload.`;

const Privacy = () => {
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
    },
  });

  const name = <strong>pprmnt</strong>;
  /* eslint-disable react/no-unescaped-entities */

  return (
    <Content>
      <h2>About pprmnt</h2>
      <p>
        {name} is a secure MP3 encoder that works directly in your browser.
        Convert your lossless audio to MP3 for better portability, without
        sacrificing the privacy and security of your intellectual property.
      </p>
      <h3>The use case</h3>
      <p>
        When musicians or sound artists need to share audio files, or upload
        them somewhere, they often need to first convert them to MP3. The
        lossless WAV version that the DAW software exports is often way too big
        to send easily, and can cause performance issues when uploading online.
      </p>
      <p>
        Sometimes it's easier to send a quick MP3, instead of a huge WAV or FLAC
        audio file.
      </p>
      <h3>The problem</h3>
      <p>
        Many "file conversion" websites are harvesting your data. They upload
        your lossless audio to a server, convert it there, and then send it back
        to you. This puts you at a serious risk -- you just uploaded your audio
        to some random company's server. They now have full access to your
        audio.
      </p>
      <p>
        Is your music licensed? Probably not. There's absolutely no legal reason
        stopping these companies from storing and "owning" the audio you just
        willfully uploaded to their server. Furthermore, after gaining access to
        (what used to be) your audio, there's nothing to stop that company from
        taking that audio, licensing it...and eventually taking legal action{' '}
        <strong>against you.</strong>
      </p>
      <h3>The solution</h3>
      <p>
        {name} takes a different approach, by converting the audio directly in
        your browser, without ever even leaving your machine. Your audio is
        converted locally, without ever being uploaded to a third party server.
      </p>
      <p>
        To prove this, {name} even works entirely offline. Try it out. Your
        audio never touches the internet, it all happens in your browser.
      </p>
      <p>
        As added emphasis to the security and transparency of how {name} works,{' '}
        {name} is also entirely open source. The entire source code is available{' '}
        <a
          href="https://github.com/johncalvinroberts/pprmnt"
          target="_blank"
          rel="noopener noreferrer"
        >
          here on Github
        </a>{' '}
        for your viewing enjoyment.
      </p>
      <p>
        There are also more technical details about how {name} works, the
        limitations, and future roadmap for features in the readme on Github.
      </p>
      <p>
        Any other questions about {name} can be addressed to: johnny@johnny.sh
      </p>
    </Content>
  );
};
/* eslint-enable react/no-unescaped-entities */
export default Privacy;
