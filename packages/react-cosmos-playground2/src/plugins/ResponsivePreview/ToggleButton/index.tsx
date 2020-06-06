import React from 'react';
import { IconButton32 } from '../../../shared/buttons';
import { SmartphoneIcon } from '../../../shared/icons';

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
