/** @jsx jsx */
import { jsx } from 'theme-ui';

export default ({ children, title, ...rest }) => (
  <button
    title={title}
    sx={{
      appearance: 'none',
      color: 'inherit',
      bg: 'primary',
      px: 2,
      py: 1,
      m: 0,
      fontFamily: 'inherit',
      fontSize: 'inherit',
      cursor: 'pointer',
      border: 0,
      ':focus': {
        outline: 0,
        boxShadow: '0 0 0 2px',
      },
      '&:hover': {
        bg: 'highlight',
      },
    }}
    {...rest}
  >
    <div
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  </button>
);
