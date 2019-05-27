import React from 'react';
import { createPlugin } from 'react-plugin';
import { Button } from '../../shared/ui';
import { SlidersIcon } from '../../shared/icons';
import { ControlPanel } from './ControlPanel';
import { ControlPanelSpec } from './public';
import { isOpen, useOpenToggle } from './shared';

const { plug, register } = createPlugin<ControlPanelSpec>({
  name: 'controlPanel'
});

plug('right', ({ pluginContext }) => {
  return isOpen(pluginContext) ? <ControlPanel /> : null;
});

plug('rendererActions', ({ pluginContext }) => {
  const open = isOpen(pluginContext);
  const toggleOpen = useOpenToggle(pluginContext);

  return (
    <Button
      icon={<SlidersIcon />}
      label="controls"
      selected={open}
      onClick={toggleOpen}
    />
  );
});

export { register };
