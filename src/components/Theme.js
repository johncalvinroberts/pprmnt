/** @jsx jsx */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { Global, css, jsx } from '@emotion/core';
import { COLOR_MODE_KEY } from '../constants';

const varify = (obj) => Object.keys(obj).map((key) => `--${key}: ${obj[key]};`);

const breakpoints = [576, 768, 992, 1200];

export const mq = breakpoints.map((bp) => `@media (max-width: ${bp}px)`);

export const theme = {
  colors: {
    dark: {
      background: `#252424`,
      muted: `hsla(0, 1%, 10%, 1)`,
      error: `#ff4c4c`,
      text: `hsl(210, 50%, 96%)`,
    },
    light: {
      background: `hsl(210, 50%, 96%)`,
      muted: `#c1c1c1`,
      error: `#ff4c4c`,
      text: `#252424`,
    },
  },
  fonts: {
    body: `"input_mono_regular", courier,monospace`,
  },
  fontWeights: {
    body: 400,
    heading: 700,
    display: 900,
  },
  lineHeights: {
    body: 1.5,
  },
  space: {
    xsmol: '0.5rem',
    smol: '1rem',
    med: '1.4rem',
    lrg: '2rem',
    xlrg: '2.5rem',
  },
};

const getGlobalStyles = (colorMode) => css`
  @font-face {
    font-family: 'input_mono_regular';
    src: url('/InputMono-Regular.6e8cbed8.woff2') format('woff2');
    font-weight: normal;
    font-display: swap;
    font-style: normal;
    font-display: swap;
  }

  html {
    font-size: 10px;
  }

  * {
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
  }

  :root {
    ${varify(theme.colors[colorMode])}
    ${varify(theme.space)}
  }

  body {
    background-color: var(--background);
    font-family: ${theme.fonts.body};
    font-size: var(--med);
  }
`;

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const modes = {
  dark: 'dark',
  light: 'light',
};

const getInitialColorMode = () => {
  const { light, dark } = modes;
  const setting = localStorage.getItem(COLOR_MODE_KEY);
  if (setting && modes[setting]) return setting;
  const prefersLight =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: light)').matches;
  const ret = prefersLight ? light : dark;
  localStorage.setItem(COLOR_MODE_KEY, ret);
  return ret;
};

export default ({ children }) => {
  const [colorMode, setColorMode] = useState(getInitialColorMode());

  const toggleColorMode = useCallback(() => {
    const { light, dark } = modes;
    const nextColorMode = colorMode === dark ? light : dark;

    setColorMode(nextColorMode);
  }, [colorMode]);

  useEffect(() => {
    setColorMode(colorMode);
    localStorage.setItem(COLOR_MODE_KEY, colorMode);
  }, [colorMode]);

  const globalStyles = useMemo(() => getGlobalStyles(colorMode), [colorMode]);

  return (
    <ThemeContext.Provider value={{ setColorMode, colorMode, toggleColorMode }}>
      <Global styles={globalStyles} />
      {children}
    </ThemeContext.Provider>
  );
};
