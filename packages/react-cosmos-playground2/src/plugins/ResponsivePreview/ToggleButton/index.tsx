import React from 'react';
import { SmartphoneIcon } from '../../../shared/icons';
import { IconButton32 } from '../../../shared/ui/buttons';

type Props = {
  validFixtureSelected: boolean;
  enabled: boolean;
  toggleViewportState: () => unknown;
};

export function ToggleButton({
  validFixtureSelected,
  enabled,
  toggleViewportState
}: Props) {
  if (!validFixtureSelected) {
    return (
      <IconButton32
        icon={<SmartphoneIcon />}
        title="Toggle responsive mode"
        disabled
      />
    );
  }

  return (
    <IconButton32
      icon={<SmartphoneIcon />}
      title="Toggle responsive mode"
      selected={enabled}
      onClick={toggleViewportState}
    />
  );
}
