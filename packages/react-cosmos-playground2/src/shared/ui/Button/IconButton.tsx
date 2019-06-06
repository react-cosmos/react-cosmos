import React from 'react';
import { StyledButton, Icon } from './shared';

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
