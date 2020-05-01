/** @jsx jsx */
import { useState } from 'react';
import { jsx, css } from '@emotion/core';
import Button, { ButtonBase } from './Button';

const DropdownItem = ({ item, handleSelect }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    handleSelect(item.value);
  };

  return (
    <ButtonBase
      Component="li"
      css={css`
        width: 200px;
        color: var(--text);
        text-align: left;
      `}
      role="menuitem"
      tabIndex="0"
      onClick={handleClick}
      onKeyDown={handleClick}
    >
      {item.label}
    </ButtonBase>
  );
};

export default ({ handleSelect, choices, label, ...rest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);

  const handleMouseLeave = () => {
    if (isOpen) setIsOpen(false);
  };

  return (
    <Button
      css={css`
        position: relative;
        height: 20px;
      `}
      aria-haspopup="listbox"
      onClick={toggleIsOpen}
      aria-expanded={isOpen}
      onMouseLeave={handleMouseLeave}
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
          top: 21px;
          left: 0px;
          list-style: none;
          box-shadow: 2px 2px 0px var(--muted);
          display: ${isOpen ? 'block' : 'none'};
        `}
      >
        {choices.map((item) => (
          <DropdownItem
            item={item}
            handleSelect={handleSelect}
            key={item.value}
          />
        ))}
      </ul>
    </Button>
  );
};
