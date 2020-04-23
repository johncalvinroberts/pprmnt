/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useState } from 'react';
import { useInterval } from '../hooks';

export const shuffle = (array) => {
  // eslint-disable-next-line
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

const initialColors = [
  '#FF008C',
  'hsl(260, 100%, 80%)',
  'hsl(290, 100%, 80%)',
  'hsl(210, 50%, 96%)',
];

export default (props) => {
  const [colors, setColors] = useState(initialColors);

  useInterval(() => setColors(shuffle([...colors])), 500);

  return (
    <div {...props}>
      <div
        css={css`
          position: relative;
          display: flex;
          width: 20px;
          height: 20px;
          flex-wrap: wrap;
        `}
      >
        {colors.map((background) => (
          <span
            key={background}
            style={{ background }}
            css={css`
              width: 10px;
              height: 10px;
            `}
          />
        ))}
      </div>
    </div>
  );
};
