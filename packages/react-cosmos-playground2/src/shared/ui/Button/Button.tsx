import React from 'react';
import { StyledButton, Icon, Label } from './shared';

type Props = {
  icon?: React.ReactNode;
  label: React.ReactNode;
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
      <Label>{label}</Label>
    </StyledButton>
  );
}
