import React from 'react';
import { SmartphoneIcon } from '../../../shared/icons';
import { DarkIconButton } from '../../../shared/ui/buttons';

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
      <DarkIconButton
        icon={<SmartphoneIcon />}
        title="Toggle responsive mode"
        disabled
      />
    );
  }

  return (
    <DarkIconButton
      icon={<SmartphoneIcon />}
      title="Toggle responsive mode"
      selected={enabled}
      onClick={toggleViewportState}
    />
  );
}
