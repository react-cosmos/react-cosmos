import React from 'react';
import { DarkStyledButton, DarkIcon } from './shared';

type Props = {
  icon: React.ReactNode;
  title: string;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => unknown;
};

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
