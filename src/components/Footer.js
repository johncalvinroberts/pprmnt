/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Link } from './Button';

export default () => (
  <footer
    css={css`
      height: 40px;
      display: flex;
      justify-content: flex-start;
      grid-column: 1;
      position: sticky;
      bottom: 0;
      background: var(--background);
      font-size: var(--smol);
      padding: var(--smol);
      padding-left: var(--xlrg);
    `}
  >
    <span
      css={css`
        padding-right: var(--smol);
      `}
    >
      © {new Date().getFullYear()}
    </span>
    <span>
      <Link href="/privacy">privacy</Link>
    </span>
    <span>
      <Link href="/about">about</Link>
    </span>
  </footer>
);
