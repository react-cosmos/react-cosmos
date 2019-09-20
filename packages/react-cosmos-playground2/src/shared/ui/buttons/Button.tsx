import React from 'react';
import { DarkStyledButton, DarkIcon, Label } from './shared';

type Props = {
  icon?: React.ReactNode;
  title?: string;
  label: React.ReactNode;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => unknown;
};

export function DarkButton({
  icon,
  label,
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
      {icon && <DarkIcon>{icon}</DarkIcon>}
      <Label>{label}</Label>
    </DarkStyledButton>
  );
}
