import React from 'react';
import { RendererId } from 'react-cosmos-shared2/renderer';
import { createPlugin } from 'react-plugin';
import { RendererCoreSpec } from '../RendererCore/public';
import { RouterSpec } from '../Router/public';
import { ControlPanel } from './ControlPanel';
import { ControlPanelSpec } from './public';

const { plug, register } = createPlugin<ControlPanelSpec>({
  name: 'controlPanel'
});

plug('right', ({ pluginContext: { getMethodsOf } }) => {
  const router = getMethodsOf<RouterSpec>('router');
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');

  return (
    <ControlPanel
      selectedFixtureId={router.getSelectedFixtureId()}
      connectedRendererIds={rendererCore.getConnectedRendererIds()}
      primaryRendererId={rendererCore.getPrimaryRendererId()}
      fixtureState={rendererCore.getFixtureState()}
      setFixtureState={rendererCore.setFixtureState}
      selectPrimaryRenderer={(rendererId: RendererId) => {
        rendererCore.selectPrimaryRenderer(rendererId);
      }}
    />
  );
});

export { register };
