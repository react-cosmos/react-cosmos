import React from 'react';
import { StyledButton, Icon, Label } from './shared';

type Props = {
  icon?: React.ReactNode;
  title?: string;
  label: React.ReactNode;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => unknown;
};

export function Button({
  icon,
  label,
  title,
  disabled = false,
  selected = false,
  onClick
}: Props) {
  return (
    <StyledButton
      title={title}
      selected={selected}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <Icon>{icon}</Icon>}
      <Label>{label}</Label>
    </StyledButton>
  );
}
