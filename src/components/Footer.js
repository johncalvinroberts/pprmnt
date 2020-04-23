/** @jsx jsx */
import { css, jsx } from '@emotion/core';

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
    `}
  >
    <span
      css={css`
        font-size: var(--smol);
        padding: var(--smol);
      `}
    >
      © {new Date().getFullYear()}
    </span>
  </footer>
);
