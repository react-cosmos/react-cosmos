// @flow

import React from 'react';
import styled from 'styled-components';

type Props = {
  label: React$Node,
  icon?: React$Node,
  disabled?: boolean,
  selected?: boolean,
  onClick?: () => mixed
};

export function Button({
  icon,
  label,
  disabled = false,
  selected = false,
  onClick
}: Props) {
  return (
    <StyledButton selected={selected} disabled={disabled} onClick={onClick}>
      {icon && <Icon>{icon}</Icon>}
      {label}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  --selected-bg: var(--grey5);
  --hover-bg: hsl(var(--hue-primary), 25%, 95%);
  --press-bg: hsl(var(--hue-primary), 25%, 93%);

  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 0 4px;
  padding: 0 8px;
  min-height: 32px;
  border: 0;
  border-radius: 3px;
  background: ${props =>
    props.selected ? 'var(--selected-bg)' : 'transparent'};
  color: ${props => (props.selected ? 'var(--grey1)' : 'var(--grey2)')};
  white-space: nowrap;
  user-select: none;
  outline: none;
  transition: background var(--quick), color var(--quick), opacity var(--quick);

  :first-child {
    margin-left: 0;
  }

  :hover {
    background: ${props =>
      props.selected ? 'var(--selected-bg)' : 'var(--hover-bg)'};
  }

  :active {
    background: ${props =>
      props.selected ? 'var(--selected-bg)' : 'var(--press-bg)'};
  }

  :disabled {
    background: ${props =>
      props.selected ? 'var(--selected-bg)' : 'transparent'};
    cursor: default;
    opacity: 0.5;
  }
`;

const Icon = styled.span`
  --size: 16px;
  width: var(--size);
  height: var(--size);
  padding: 2px 6px 0 0;
  color: var(--grey3);
`;
