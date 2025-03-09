import React from 'react';
import {
  UserModuleWrappers,
  getFixtureListFromWrappers,
} from 'react-cosmos-core';
import { RendererSync } from './RendererSync.js';
import { SelectedFixture } from './SelectedFixture.js';

type Props = {
  moduleWrappers: UserModuleWrappers;
  // Receiving the fixture selection as a prop instead of reading it from the
  // RendererContext enables using this component on the server, in which case
  // the selected fixture is read from server-side URL params.
  selectedFixture: SelectedFixture | null;
  renderMessage: (msg: string) => React.ReactNode;
  renderFixture: (selected: SelectedFixture) => React.ReactNode;
};
export function FixtureLoaderConnect({
  moduleWrappers,
  selectedFixture,
  renderMessage,
  renderFixture,
}: Props) {
  const fixtures = React.useMemo(
    () => getFixtureListFromWrappers(moduleWrappers),
    [moduleWrappers]
  );

  function renderInner() {
    if (!selectedFixture) {
      return renderMessage('No fixture selected.');
    }

    const { fixtureId } = selectedFixture;
    if (!fixtures[fixtureId.path]) {
      return renderMessage(`Fixture not found: ${fixtureId.path}`);
    }

    return renderFixture(selectedFixture);
  }

  return <RendererSync fixtures={fixtures}>{renderInner()}</RendererSync>;
}
