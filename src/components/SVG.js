/** @jsx jsx */
import { jsx } from '@emotion/core';

const SVG = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentcolor"
    {...props}
  />
);

export const Down = (props) => (
  <SVG {...props}>
    <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
  </SVG>
);

export const Up = (props) => (
  <SVG {...props}>
    <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
  </SVG>
);

export const Close = (props) => (
  <SVG {...props}>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </SVG>
);

export const Color = (props) => (
  <SVG {...props}>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentcolor"
      strokeWidth="2"
      fill="none"
    />
  </SVG>
);

export default SVG;
