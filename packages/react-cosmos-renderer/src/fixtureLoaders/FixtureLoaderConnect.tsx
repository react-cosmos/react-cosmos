import React from 'react';
import {
  FixtureId,
  UserModuleWrappers,
  getFixtureListFromWrappers,
  isInsideWindowIframe,
} from 'react-cosmos-core';
import { FixtureListRendererResponse } from './FixtureListRendererResponse.js';
import { FixtureSelection } from './useFixtureSelection.js';

type Props = {
  moduleWrappers: UserModuleWrappers;
  fixtureSelection: FixtureSelection | null;
  initialFixtureId?: FixtureId | null;
  renderMessage: (msg: string) => React.ReactElement;
  renderFixture: (selection: FixtureSelection) => React.ReactElement;
};
export function FixtureLoaderConnect({
  moduleWrappers,
  fixtureSelection = null,
  initialFixtureId = null,
  renderMessage,
  renderFixture,
}: Props) {
  const fixtures = React.useMemo(
    () => getFixtureListFromWrappers(moduleWrappers),
    [moduleWrappers]
  );

  function renderInner() {
    if (!fixtureSelection) {
      return isInsideWindowIframe()
        ? null
        : renderMessage('No fixture selected.');
    }

    const { fixtureId } = fixtureSelection;
    if (!fixtures[fixtureId.path]) {
      return renderMessage(`Fixture path not found: ${fixtureId.path}`);
    }

    return renderFixture(fixtureSelection);
  }

  return (
    <FixtureListRendererResponse
      fixtures={fixtures}
      initialFixtureId={initialFixtureId}
    >
      {renderInner()}
    </FixtureListRendererResponse>
  );
}
