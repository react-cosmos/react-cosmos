import React from 'react';
import {
  UserModuleWrappers,
  getFixtureListFromWrappers,
  isInsideWindowIframe,
} from 'react-cosmos-core';
import { RendererSync } from '../rendererConnect/RendererSync.js';
import { FixtureSelection } from './useFixtureSelection.js';

type Props = {
  moduleWrappers: UserModuleWrappers;
  // Receiving the fixture selection as a prop instead of reading it from the
  // RendererContext enables using this component on the server, in which case
  // the selected fixture is read from the server-side URL search params.
  fixtureSelection: FixtureSelection | null;
  renderMessage: (msg: string) => React.ReactElement;
  renderFixture: (selection: FixtureSelection) => React.ReactElement;
};
export function FixtureLoaderConnect({
  moduleWrappers,
  fixtureSelection = null,
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

  return <RendererSync fixtures={fixtures}>{renderInner()}</RendererSync>;
}
