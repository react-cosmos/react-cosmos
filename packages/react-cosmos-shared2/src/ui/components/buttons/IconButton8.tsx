import React from 'react';
import {
  grey144,
  grey176,
  grey216,
  grey24,
  grey248,
  grey32,
  grey8,
} from '../colors';
import { StyledButton, StyledIcon } from './shared';

type Props = {
  icon: React.ReactNode;
  title: string;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => unknown;
};

export function IconButton8({
  icon,
  title,
  disabled = false,
  selected = false,
  onClick,
}: Props) {
  return (
    <StyledButton
      bg={grey8}
      bgSelect={grey32}
      bgHover={grey24}
      color={grey216}
      colorSelect={grey248}
      title={title}
      selected={selected}
      disabled={disabled}
      onClick={onClick}
    >
      <StyledIcon color={selected ? grey176 : grey144}>{icon}</StyledIcon>
    </StyledButton>
  );
}
