import React from 'react';
import { useFixtureInput } from 'react-cosmos/client';
import { PluginList, SimplePlugin } from './PluginList.js';

const initialPlugins: SimplePlugin[] = [
  { name: 'buildNotifications', enabled: true },
  { name: 'classStatePanel', enabled: true },
  { name: 'core', enabled: true },
  { name: 'fixtureBookmark', enabled: true },
  { name: 'fixtureSearch', enabled: true },
  { name: 'fixtureTree', enabled: true },
  { name: 'fullScreenButton', enabled: true },
  { name: 'inputsPanel', enabled: true },
  { name: 'messageHandler', enabled: true },
  { name: 'notifications', enabled: true },
  { name: 'pluginList', enabled: false },
  { name: 'propsPanel', enabled: true },
  { name: 'remoteRenderer', enabled: true },
  { name: 'rendererCore', enabled: true },
  { name: 'rendererPreview', enabled: true },
  { name: 'rendererSelect', enabled: false },
  { name: 'responsivePreview', enabled: true },
  { name: 'root', enabled: true },
  { name: 'router', enabled: true },
  { name: 'selectInput', enabled: true },
  { name: 'standardInput', enabled: true },
  { name: 'storage', enabled: true },
];

export default () => {
  const [plugins, setPlugins] = useFixtureInput('plugins', initialPlugins);
  return (
    <PluginList
      plugins={plugins}
      enable={(pluginName, enabled) =>
        setPlugins(prevPlugins =>
          prevPlugins.map(p => (p.name === pluginName ? { ...p, enabled } : p))
        )
      }
    />
  );
};
