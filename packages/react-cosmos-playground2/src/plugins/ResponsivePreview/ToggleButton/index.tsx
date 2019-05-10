import * as React from 'react';
import { SmartphoneIcon } from '../../../shared/icons';
import { Button } from '../../../shared/ui';

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
    return <Button icon={<SmartphoneIcon />} label="responsive" disabled />;
  }

  return (
    <Button
      icon={<SmartphoneIcon />}
      label="responsive"
      selected={responsiveModeOn}
      onClick={toggleViewportState}
    />
  );
}
