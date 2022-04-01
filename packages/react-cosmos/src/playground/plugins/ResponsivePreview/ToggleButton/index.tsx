import React from 'react';
import { IconButton32 } from '../../../ui/components/buttons';
import { SmartphoneIcon } from '../../../ui/components/icons';

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
