import React from 'react';
import {
  grey160,
  grey176,
  grey224,
  grey24,
  grey248,
  grey32,
  grey8
} from '../colors';
import { Label, StyledButton, StyledIcon } from './shared';

type Props = {
  icon?: React.ReactNode;
  title?: string;
  label: React.ReactNode;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => unknown;
};

export function Button32({
  icon,
  label,
  title,
  disabled = false,
  selected = false,
  onClick
}: Props) {
  return (
    <StyledButton
      bg={grey32}
      bgSelect={grey8}
      bgHover={grey24}
      color={grey224}
      colorSelect={grey248}
      title={title}
      selected={selected}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && (
        <StyledIcon color={selected ? grey176 : grey160}>{icon}</StyledIcon>
      )}
      <Label>{label}</Label>
    </StyledButton>
  );
}
