import React from 'react';
import { IconButton8, MenuIcon } from 'react-cosmos-shared2/ui';

type Props = {
  disabled?: boolean;
  selected: boolean;
  onToggle: () => unknown;
};

export function ToggleNavButton({ disabled, selected, onToggle }: Props) {
  return (
    <IconButton8
      title="Show fixture list"
      icon={<MenuIcon />}
      disabled={disabled}
      selected={selected}
      onClick={onToggle}
    />
  );
}
