import * as React from 'react';
import styled from 'styled-components';

type Props = {
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => unknown;
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

type StyledButtonProps = {
  selected: boolean;
  disabled: boolean;
};

const StyledButton = styled.button<StyledButtonProps>`
  --selected-bg: var(--grey5);
  --hover-bg: hsl(var(--hue-primary), 25%, 95%);

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

  :focus {
    box-shadow: 0px 0px 1px 1px var(--primary4);
  }

  :disabled {
    background: ${props =>
      props.selected ? 'var(--selected-bg)' : 'transparent'};
    cursor: default;
    opacity: 0.5;
  }

  ::-moz-focus-inner {
    border: 0;
  }
`;

const Icon = styled.span`
  --size: 16px;
  width: var(--size);
  height: var(--size);
  padding: 2px 6px 0 0;
  color: var(--grey3);
`;
