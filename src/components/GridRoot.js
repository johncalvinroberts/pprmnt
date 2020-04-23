/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { theme } from './Theme';

export default (props) => (
  <div
    {...props}
    css={css`
      font-family: ${theme.fonts.body};
      color: var(--text);
      line-height: ${theme.lineHeights.body};
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr 70px;
      max-width: 1240px;
      min-height: 100vh;
      position: relative;
    `}
  />
);
