import React from 'react';
import { createPlugin } from 'react-plugin';
import { IconButton } from '../../shared/ui';
import { SlidersIcon } from '../../shared/icons';
import { ControlPanel } from './ControlPanel';
import { ControlPanelSpec } from './public';
import { isOpen, useOpenToggle, isValidFixtureSelected } from './shared';

const { plug, register } = createPlugin<ControlPanelSpec>({
  name: 'controlPanel'
});

plug('right', ({ pluginContext }) => {
  return isValidFixtureSelected(pluginContext) && isOpen(pluginContext) ? (
    <ControlPanel />
  ) : null;
});

plug('rendererActions', ({ pluginContext }) => {
  const open = isOpen(pluginContext);
  const toggleOpen = useOpenToggle(pluginContext);

  if (!isValidFixtureSelected(pluginContext)) {
    return (
      <IconButton
        icon={<SlidersIcon />}
        title="Open control panel"
        disabled
        selected={false}
      />
    );
  }

  return (
    <IconButton
      icon={<SlidersIcon />}
      title="Open control panel"
      selected={open}
      onClick={toggleOpen}
    />
  );
});

export { register };
