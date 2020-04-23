/** @jsx jsx */
import { css, jsx } from '@emotion/core';

export default ({ children, ...props }) => (
  <div
    {...props}
    css={css`
      align-items: center;
      display: flex;
      justify-content: center;
    `}
  >
    {children}
  </div>
);
