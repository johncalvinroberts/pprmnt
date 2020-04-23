/** @jsx jsx */
import { jsx } from 'theme-ui';
import { Close } from './SVG';

const Button = ({ children, title, ...rest }) => (
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

export const CloseButton = ({ size = 32, ...props }) => (
  <button
    {...props}
    sx={{
      appearance: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 1,
      width: size,
      height: size,
      color: 'inherit',
      bg: 'transparent',
      border: 'none',
      borderRadius: 0,
      cursor: 'pointer',
    }}
  >
    <Close />
  </button>
);

export default Button;
