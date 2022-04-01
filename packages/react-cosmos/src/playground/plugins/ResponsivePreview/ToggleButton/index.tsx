import React from 'react';
import { IconButton32 } from '../../../components/buttons/index.js';
import { SmartphoneIcon } from '../../../components/icons/index.js';

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
