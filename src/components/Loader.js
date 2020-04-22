/** @jsx jsx */
import { jsx } from 'theme-ui';
import { useState, useEffect } from 'react';

const shuffle = (arr) => [arr.pop(), ...arr];
const initialColors = [
  '#FF008C',
  'hsl(260, 100%, 80%)',
  'hsl(290, 100%, 80%)',
  'hsl(210, 50%, 96%)',
];

export default (props) => {
  const [colors, setColors] = useState(initialColors);

  useEffect(() => {
    setTimeout(() => setColors(shuffle([...colors])), 500);
  }, [colors]);

  return (
    <div {...props}>
      <div
        sx={{
          position: 'relative',
          display: 'flex',
          width: '20px',
          height: '20px',
          flexWrap: 'wrap',
        }}
      >
        {colors.map((background) => (
          <span
            key={background}
            style={{ background }}
            sx={{
              width: '10px',
              height: '10px',
            }}
          />
        ))}
      </div>
    </div>
  );
};
