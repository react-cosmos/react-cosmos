import React from 'react';
import { SmartphoneIcon } from '../../../shared/icons';
import { IconButton } from '../../../shared/ui/buttons';

type Props = {
  validFixtureSelected: boolean;
  responsiveModeOn: boolean;
  toggleViewportState: () => unknown;
};

export function ToggleButton({
  validFixtureSelected,
  responsiveModeOn,
  toggleViewportState
}: Props) {
  if (!validFixtureSelected) {
    return (
      <IconButton
        icon={<SmartphoneIcon />}
        title="Toggle responsive mode"
        disabled
      />
    );
  }

  return (
    <IconButton
      icon={<SmartphoneIcon />}
      title="Toggle responsive mode"
      selected={responsiveModeOn}
      onClick={toggleViewportState}
    />
  );
}
