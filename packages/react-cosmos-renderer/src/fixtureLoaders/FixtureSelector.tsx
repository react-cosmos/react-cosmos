import React from 'react';
import {
  FixtureId,
  UserModuleWrappers,
  getFixtureListFromWrappers,
} from 'react-cosmos-core';
import { FixtureSelectorConnect } from './FixtureSelectorConnect.js';
import { FixtureLoaderSelection } from './useFixtureLoaderState.js';

type Props = {
  moduleWrappers: UserModuleWrappers;
  selection: FixtureLoaderSelection | null;
  initialFixtureId?: FixtureId | null;
  renderMessage: (msg: string) => React.ReactElement;
  renderNoFixtureSelected?: boolean;
  renderFixture: (selection: FixtureLoaderSelection) => React.ReactElement;
};
export function FixtureSelector({
  moduleWrappers,
  selection = null,
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
    if (!selection) {
      return renderNoFixtureSelected
        ? renderMessage('No fixture selected.')
        : null;
    }

    const { fixtureId } = selection;
    if (!fixtures[fixtureId.path]) {
      return renderMessage(`Fixture path not found: ${fixtureId.path}`);
    }

    return renderFixture(selection);
  }

  return (
    <FixtureSelectorConnect
      fixtures={fixtures}
      initialFixtureId={initialFixtureId}
    >
      {renderInner()}
    </FixtureSelectorConnect>
  );
}
