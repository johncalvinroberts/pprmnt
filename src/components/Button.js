/** @jsx jsx */
import { forwardRef } from 'react';
import { jsx, css } from '@emotion/core';
import { Close } from './SVG';
import Flex from './Flex';

const ButtonBase = forwardRef(({ children, ...rest }, ref) => (
  <button
    ref={ref}
    css={css`
      appearance: none;
      color: inherit;
      background-color: transparent;
      padding-left: 8px;
      padding-right: 8px;
      padding-top: 4px;
      padding-bottom: 4px;
      margin: 0;
      font-family: inherit;
      font-size: inherit;
      cursor: pointer;
      border: 0;
      &:focus {
        box-shadow: 0 0 0 2px;
        outline: 0;
      }
      &:hover {
        background: var(--text);
        color: var(--background);
      }
    `}
    {...rest}
  >
    {children}
  </button>
));

const Button = forwardRef(({ children, title, ...rest }, ref) => (
  <ButtonBase title={title} {...rest} ref={ref}>
    <Flex>{children}</Flex>
  </ButtonBase>
));

export const CloseButton = ({ size = `32px`, ...props }) => (
  <ButtonBase
    {...props}
    title="close"
    css={css`
      appearance: none;
      color: inherit;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: ${size};
      height: ${size};
      background: transparent;
      border-radius: 0;
    `}
  >
    <Close />
  </ButtonBase>
);

export default Button;
