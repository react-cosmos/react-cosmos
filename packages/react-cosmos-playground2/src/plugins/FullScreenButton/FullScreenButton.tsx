import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { DarkIconButton } from '../../shared/ui/buttons';
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
      <DarkIconButton disabled icon={<MaximizeIcon />} title="Go fullscreen" />
    );
  }

  return (
    <DarkIconButton
      icon={<MaximizeIcon />}
      title="Go fullscreen"
      onClick={() => selectFixture(selectedFixtureId, true)}
    />
  );
}
