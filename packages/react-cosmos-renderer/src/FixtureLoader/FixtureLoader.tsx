import React from 'react';
import {
  FixtureId,
  UserModuleWrappers,
  getFixtureListFromWrappers,
} from 'react-cosmos-core';
import { FixtureLoaderConnect } from './FixtureLoaderConnect.js';
import { SelectedFixtureState } from './useSelectedFixture.js';

type Props = {
  moduleWrappers: UserModuleWrappers;
  selectedFixture: SelectedFixtureState | null;
  initialFixtureId?: FixtureId | null;
  renderMessage: (msg: string) => React.ReactElement;
  renderNoFixtureSelected?: boolean;
  renderFixture: (selectedFixture: SelectedFixtureState) => React.ReactElement;
};
export function FixtureLoader({
  moduleWrappers,
  selectedFixture = null,
  initialFixtureId = null,
  renderMessage,
  renderNoFixtureSelected,
  renderFixture,
}: Props) {
  const fixtures = React.useMemo(
    () => getFixtureListFromWrappers(moduleWrappers),
    [moduleWrappers]
  );

  function renderInner() {
    if (!selectedFixture) {
      return renderNoFixtureSelected
        ? renderMessage('No fixture selected.')
        : null;
    }

    const { fixtureId } = selectedFixture;
    if (!fixtures[fixtureId.path]) {
      return renderMessage(`Fixture path not found: ${fixtureId.path}`);
    }

    return renderFixture(selectedFixture);
  }

  return (
    <FixtureLoaderConnect
      fixtures={fixtures}
      initialFixtureId={initialFixtureId}
    >
      {renderInner()}
    </FixtureLoaderConnect>
  );
}
