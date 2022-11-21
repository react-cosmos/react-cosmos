import React from 'react';
import { createPlugin, PluginsConsumer } from 'react-plugin';
import { PluginList } from './PluginList.js';
import { PluginListSpec } from './spec.js';

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

export { register };

if (process.env.NODE_ENV !== 'test') register();
