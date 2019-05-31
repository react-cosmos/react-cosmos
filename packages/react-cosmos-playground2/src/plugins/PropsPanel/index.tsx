import React from 'react';
import { createPlugin } from 'react-plugin';
import { StateUpdater } from 'react-cosmos-shared2/util';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { RendererCoreSpec } from '../RendererCore/public';
import { PropsPanelSpec } from './public';
import { PropsPanel } from './PropsPanel';

const { plug, register } = createPlugin<PropsPanelSpec>({
  name: 'propsPanel'
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
    <PropsPanel fixtureState={fixtureState} setFixtureState={setFixtureState} />
  );
});

export { register };
