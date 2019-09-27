import React from 'react';
import { createPlugin } from 'react-plugin';
import { SlidersIcon } from '../../shared/icons';
import { RendererPanelSlotProps } from '../../shared/slots/RendererPanelSlot';
import { IconButton32 } from '../../shared/ui/buttons';
import { LayoutSpec } from '../Layout/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { ControlPanel } from './ControlPanel';
import { ControlPanelSpec } from './public';

const { plug, namedPlug, register } = createPlugin<ControlPanelSpec>({
  name: 'controlPanel',
  defaultConfig: {
    controlPanelRowOrder: []
  }
});

plug<RendererPanelSlotProps>(
  'rendererPanel',
  ({ pluginContext, slotProps }) => {
    const { controlPanelRowOrder } = pluginContext.getConfig();
    const { fixtureId } = slotProps;
    const layout = pluginContext.getMethodsOf<LayoutSpec>('layout');
    const rendererCore = pluginContext.getMethodsOf<RendererCoreSpec>(
      'rendererCore'
    );

    if (!layout.isPanelOpen()) {
      return null;
    }

    return (
      <ControlPanel
        fixtureId={fixtureId}
        fixtureState={rendererCore.getFixtureState()}
        onFixtureStateChange={rendererCore.setFixtureState}
        controlPanelRowOrder={controlPanelRowOrder}
      />
    );
  }
);

namedPlug('rendererAction', 'controlPanel', ({ pluginContext }) => {
  const layout = pluginContext.getMethodsOf<LayoutSpec>('layout');
  const panelOpen = layout.isPanelOpen();
  return (
    <IconButton32
      icon={<SlidersIcon />}
      title="Open control panel"
      selected={panelOpen}
      onClick={() => layout.openPanel(!panelOpen)}
    />
  );
});

export { register };
