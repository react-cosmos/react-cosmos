import React from 'react';
import { MenuIcon } from '../../shared/icons';
import { IconButton } from '../../shared/ui/buttons';

type Props = {
  disabled?: boolean;
  selected: boolean;
  onToggle: () => unknown;
};

export function ToggleNavButton({ disabled, selected, onToggle }: Props) {
  return (
    <IconButton
      title="Show fixture list"
      icon={<MenuIcon />}
      disabled={disabled}
      selected={selected}
      onClick={onToggle}
    />
  );
}
