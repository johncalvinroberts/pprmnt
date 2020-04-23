/** @jsx jsx */
import { useRef, useEffect } from 'react';
import { jsx, css } from '@emotion/core';

export const headerOuterRef = { current: null };

export default () => {
  const headerRef = useRef();

  useEffect(() => {
    headerOuterRef.current = headerRef.current;
  }, []);

  return (
    <header
      css={css`
        background: var(--transparent);
        position: sticky;
        padding: var(--smol) var(--xlrg);
        grid-column: 1 / span 2;
        top: 0;
        z-index: 99;
      `}
      ref={headerRef}
    >
      <h1>ppprmnt.</h1>
      <h3>A simple, secure mp3 encoder in your browser.</h3>
    </header>
  );
};
