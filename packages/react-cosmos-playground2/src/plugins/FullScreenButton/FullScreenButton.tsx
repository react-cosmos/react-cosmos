import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { IconButton32 } from '../../shared/ui/buttons';
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
    return (
      <IconButton32 disabled icon={<MaximizeIcon />} title="Go fullscreen" />
    );
  }

  return (
    <IconButton32
      icon={<MaximizeIcon />}
      title="Go fullscreen"
      onClick={() => selectFixture(selectedFixtureId, true)}
    />
  );
}
