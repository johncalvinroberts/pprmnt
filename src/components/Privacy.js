/** @jsx jsx */
import { jsx } from '@emotion/core';
import Content from './Content';
import { Link } from './Button';
import { useHead } from '../hooks';

const titleContent = `pprmnt - Privacy Policy`;
const descriptionContent = `Privacy policy of no-upload-to-third-party mp3 encoded pprmnt`;

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

  return (
    <Content>
      <h2>Privacy Policy</h2>
      <p>
        The impetus and motivation behind <strong>pprmnt</strong> is to protect
        the privacy and intellectual property of musicians and sound artists.
      </p>
      <p>
        Maintaining the security of audio files is the number one goal of{' '}
        <strong>pprmnt</strong>. To read more about how this application
        maintains security of audio files, please check the
        <Link href="/about">about section.</Link>
      </p>
      <h3>What Information Do We Collect?</h3>
      {/* <p>
        We collect simple analytics about traffic to the application, explicitly
        limited to:
      </p>
      <ul>
        <li>Which pages are visited</li>
        <li>How much time is spent on the application</li>
      </ul> */}
      <p>
        Absolutely no personal data is tracked or stored by the application.
      </p>
      <p>Absolutely no audio data is tracked or stored by the application.</p>
      <h3>How Do We Use the Information?</h3>
      {/* <p>
        By aggregating which pages are visited the most and how much time is
        spent on the application, we can hopefully discern some information
        about interest in the application and its usefulness to musicians and
        sound artists.
      </p> */}
      <h3>Questions</h3>
      <p>
        Any questions about this Privacy Policy should be addressed to:
        johnny@johnny.sh
      </p>
    </Content>
  );
};

export default Privacy;
