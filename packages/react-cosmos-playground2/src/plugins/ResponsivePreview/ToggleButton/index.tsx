import React from 'react';
import { SmartphoneIcon } from '../../../shared/icons';
import { IconButton32 } from '../../../shared/ui/buttons';

type Props = {
  selected: boolean;
  onToggle: () => unknown;
};

export function ToggleButton({ selected, onToggle }: Props) {
  return (
    <IconButton32
      icon={<SmartphoneIcon />}
      title="Toggle responsive mode"
      selected={selected}
      onClick={onToggle}
    />
  );
}
