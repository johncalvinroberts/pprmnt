/** @jsx jsx */
import { useRef, useEffect } from 'react';
import { jsx, Styled } from 'theme-ui';

export const headerOuterRef = { current: null };

export default () => {
  const headerRef = useRef();

  useEffect(() => {
    headerOuterRef.current = headerRef.current;
  }, []);

  return (
    <header
      sx={{
        gridColumn: '1 / span 2',
        position: 'sticky',
        px: 4,
        py: 1,
        top: 0,
        zIndex: [99, 99, null],
        bg: ['background', 'background', 'transparent'],
      }}
      ref={headerRef}
    >
      <Styled.h1>peppermint.</Styled.h1>
      <Styled.h3>A simple, secure mp3 encoder in your browser.</Styled.h3>
    </header>
  );
};
