import React from 'react';
import { createPlugin } from 'react-plugin';
import { IconButton32 } from '../../shared/ui/buttons';
import { SlidersIcon } from '../../shared/icons';
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
