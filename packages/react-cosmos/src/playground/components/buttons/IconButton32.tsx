import React from 'react';
import {
  grey160,
  grey176,
  grey224,
  grey24,
  grey248,
  grey32,
  grey8,
} from '../../core/colors';
import { StyledButton, StyledIcon } from './shared';

type Props = {
  icon: React.ReactNode;
  title: string;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => unknown;
};

export function IconButton32({
  icon,
  title,
  disabled = false,
  selected = false,
  onClick,
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
      <StyledIcon color={selected ? grey176 : grey160}>{icon}</StyledIcon>
    </StyledButton>
  );
}
