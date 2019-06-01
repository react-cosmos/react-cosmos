import React from 'react';
import { createPlugin } from 'react-plugin';
import { StateUpdater } from 'react-cosmos-shared2/util';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { RendererCoreSpec } from '../RendererCore/public';
import { ClassStatePanelSpec } from './public';
import { ClassStatePanel } from './ClassStatePanel';

const { plug, register } = createPlugin<ClassStatePanelSpec>({
  name: 'classStatePanel'
});

plug('controlPanelRow', ({ pluginContext: { getMethodsOf } }) => {
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtureState = rendererCore.getFixtureState();

  const setFixtureState = React.useCallback(
    (fixtureStateUpdater: StateUpdater<FixtureState>) =>
      rendererCore.setFixtureState(fixtureStateUpdater),
    [rendererCore]
  );

  return (
    <ClassStatePanel
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    />
  );
});

export { register };
