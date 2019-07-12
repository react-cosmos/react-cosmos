import React from 'react';
import { createPlugin } from 'react-plugin';
import { IconButton } from '../../shared/ui/buttons';
import { SlidersIcon } from '../../shared/icons';
import { RendererCoreSpec } from '../RendererCore/public';
import { LayoutSpec } from '../Layout/public';
import { ControlPanel } from './ControlPanel';
import { ControlPanelSpec } from './public';

const { plug, namedPlug, register } = createPlugin<ControlPanelSpec>({
  name: 'controlPanel',
  defaultConfig: {
    controlPanelRowOrder: []
  }
});

plug('panel', ({ pluginContext }) => {
  const { controlPanelRowOrder } = pluginContext.getConfig();
  const layout = pluginContext.getMethodsOf<LayoutSpec>('layout');
  return layout.isPanelOpen() ? (
    <ControlPanel controlPanelRowOrder={controlPanelRowOrder} />
  ) : null;
});

namedPlug('rendererActions', 'controlPanel', ({ pluginContext }) => {
  const { getMethodsOf } = pluginContext;
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  if (!rendererCore.isValidFixtureSelected()) {
    return (
      <IconButton
        icon={<SlidersIcon />}
        title="Open control panel"
        disabled
        selected={false}
      />
    );
  }

  const layout = pluginContext.getMethodsOf<LayoutSpec>('layout');
  const panelOpen = layout.isPanelOpen();
  return (
    <IconButton
      icon={<SlidersIcon />}
      title="Open control panel"
      selected={panelOpen}
      onClick={() => layout.openPanel(!panelOpen)}
    />
  );
});

export { register };
