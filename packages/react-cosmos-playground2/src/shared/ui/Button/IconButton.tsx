import React from 'react';
import { StyledButton, DarkStyledButton, Icon, DarkIcon } from './shared';

type Props = {
  icon: React.ReactNode;
  title: string;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => unknown;
};

export function IconButton({
  icon,
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
      <Icon>{icon}</Icon>
    </StyledButton>
  );
}

export function DarkIconButton({
  icon,
  title,
  disabled = false,
  selected = false,
  onClick
}: Props) {
  return (
    <DarkStyledButton
      title={title}
      selected={selected}
      disabled={disabled}
      onClick={onClick}
    >
      <DarkIcon>{icon}</DarkIcon>
    </DarkStyledButton>
  );
}
