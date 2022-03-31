import React from 'react';
import { IconButton8 } from '../../../ui/components/buttons';
import { MenuIcon } from '../../../ui/components/icons';

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
