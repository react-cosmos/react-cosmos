import React from 'react';
import { createPlugin } from 'react-plugin';
import { RendererCoreSpec } from '../RendererCore/public';
import { RouterSpec } from '../Router/public';
import { CustomStatePanel } from './CustomStatePanel';
import { CustomStatePanelSpec } from './public';

const { namedPlug, register } = createPlugin<CustomStatePanelSpec>({
  name: 'customStatePanel'
});

namedPlug('controlPanelRow', 'customState', ({ pluginContext }) => {
  const { getMethodsOf } = pluginContext;
  const routerCore = getMethodsOf<RouterSpec>('router');
  const selectedFixtureId = routerCore.getSelectedFixtureId();
  if (selectedFixtureId === null) {
    return null;
  }

  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtureState = rendererCore.getFixtureState();
  return (
    <CustomStatePanel
      fixtureState={fixtureState}
      fixtureExpansion={{}}
      onFixtureStateChange={rendererCore.setFixtureState}
      onElementExpansionChange={() => {}}
    />
  );
});

export { register };
