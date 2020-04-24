/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Link } from './Button';

const Content = ({ children }) => {
  return (
    <div
      css={css`
        padding: var(--med) var(--lrg);
        max-width: 600px;
      `}
    >
      <Link
        href="/"
        css={css`
          position: sticky;
          top: 108px;
          background: var(--background);
        `}
      >
        home
      </Link>
      <div
        css={css`
          padding: var(--lrg);
          h1,
          h2,
          h3,
          h4,
          h5 {
            padding-top: var(--smol);
          }
          p,
          h1,
          h2,
          h3,
          h4,
          h5,
          ul,
          ol {
            padding-bottom: var(--smol);
          }
          ul {
            padding-left: var(--lrg);
          }
          a {
            color: currentColor;
            &:hover {
              background: var(--text);
              color: var(--background);
            }
          }
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default Content;
