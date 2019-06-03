import React from 'react';
import { createPlugin } from 'react-plugin';
import { IconButton } from '../../shared/ui';
import { SlidersIcon } from '../../shared/icons';
import { RendererCoreSpec } from '../RendererCore/public';
import { LayoutSpec } from '../Layout/public';
import { ControlPanel } from './ControlPanel';
import { ControlPanelSpec } from './public';

const { plug, register } = createPlugin<ControlPanelSpec>({
  name: 'controlPanel'
});

plug('right', ({ pluginContext }) => {
  const layout = pluginContext.getMethodsOf<LayoutSpec>('layout');
  return layout.isPanelOpen() ? <ControlPanel /> : null;
});

plug('rendererActions', ({ pluginContext }) => {
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
