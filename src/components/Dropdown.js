/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import Button, { ButtonBase } from './Button';

export default ({ handleSelect, choices, label, ...rest }) => {
  return (
    <Button
      css={css`
        position: relative;
        height: 20px;
        ul {
          display: none;
        }

        &:hover {
          ul {
            display: block;
          }
        }
      `}
      aria-haspopup="true"
      {...rest}
    >
      {label}
      <ul
        role="menu"
        css={css`
          padding: 0;
          position: absolute;
          background: var(--background);
          z-index: 99;
          top: 20px;
          left: 0px;
          list-style: none;
          box-shadow: 2px 2px 0px var(--muted);
        `}
      >
        {choices.map((item) => (
          <ButtonBase
            Component="li"
            key={item.value}
            css={css`
              width: 200px;
              color: var(--text);
              text-align: left;
            `}
            role="menuitem"
            onClick={() => handleSelect(item.value)}
            onKeyDown={() => handleSelect(item.value)}
          >
            {item.label}
          </ButtonBase>
        ))}
      </ul>
    </Button>
  );
};
