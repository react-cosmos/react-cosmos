import React from 'react';
import { createPlugin, PluginsConsumer } from 'react-plugin';
import { PluginListSpec } from '../../../ui/specs/PluginListSpec';
import { PluginList } from './PluginList';

const { plug, register } = createPlugin<PluginListSpec>({
  name: 'pluginList',
});

plug('sidePanelRow', () => {
  return (
    <PluginsConsumer>
      {({ plugins, enable }) => (
        <PluginList
          plugins={plugins.map(p => ({ name: p.name, enabled: p.enabled }))}
          enable={enable}
        />
      )}
    </PluginsConsumer>
  );
});

register();
