import React from 'react';
import { useValue } from 'react-cosmos/fixture';
import { PluginList, SimplePlugin } from './PluginList';

const initialPlugins: SimplePlugin[] = [
  { name: 'buildNotifications', enabled: true },
  { name: 'classStatePanel', enabled: true },
  { name: 'contentOverlay', enabled: true },
  { name: 'controlPanel', enabled: true },
  { name: 'core', enabled: true },
  { name: 'editFixtureButton', enabled: true },
  { name: 'fixtureBookmark', enabled: true },
  { name: 'fixtureSearch', enabled: true },
  { name: 'fixtureTree', enabled: true },
  { name: 'fullScreenButton', enabled: true },
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
  { name: 'controlSelect', enabled: true },
  { name: 'standardControl', enabled: true },
  { name: 'storage', enabled: true },
  { name: 'webpackHmrNotification', enabled: true },
];

export default () => {
  const [plugins, setPlugins] = useValue('plugins', {
    defaultValue: initialPlugins,
  });
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
