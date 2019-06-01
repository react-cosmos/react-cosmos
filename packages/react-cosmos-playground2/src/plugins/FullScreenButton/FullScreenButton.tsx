import * as React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { Button } from '../../shared/ui';
import { MaximizeIcon } from '../../shared/icons';

type Props = {
  selectedFixtureId: FixtureId | null;
  validFixtureSelected: boolean;
  selectFixture: (fixtureId: FixtureId, fullScreen: boolean) => void;
};

export function FullScreenButton({
  selectedFixtureId,
  selectFixture,
  validFixtureSelected
}: Props) {
  if (!selectedFixtureId || !validFixtureSelected) {
    return <Button disabled icon={<MaximizeIcon />} label="fullscreen" />;
  }

  return (
    <Button
      icon={<MaximizeIcon />}
      label="fullscreen"
      onClick={() => selectFixture(selectedFixtureId, true)}
    />
  );
}
