import React from 'react';
import ReactDom from 'react-dom';
import * as ReactPlugin from 'react-plugin';
import { CosmosPluginConfig } from '../server/cosmosPlugin/types.js';
import { CoreSpec } from './plugins/Core/spec.js';
import './plugins/pluginEntry.js';
import { DEFAULT_PLUGIN_CONFIG } from './shared/defaultPluginConfig.js';
import { GlobalStyle } from './style/globalStyle.js';

declare global {
  interface Window {
    ReactPlugin: any;
    React: any;
    ReactDom: any;
  }
}

// Enable external plugins to use a shared copy of react-plugin. Also enable
// fiddling with plugins from browser console :D.
window.ReactPlugin = ReactPlugin;
window.React = React;
window.ReactDom = ReactDom;

// Config can also contain keys for 3rd party plugins
export type PlaygroundConfig = {
  core: CoreSpec['config'];
  [pluginName: string]: {};
};

export type PlaygroundMountArgs = {
  playgroundConfig: PlaygroundConfig;
  pluginConfigs: CosmosPluginConfig[];
};

export default function mount({
  playgroundConfig,
  pluginConfigs,
}: PlaygroundMountArgs) {
  const { loadPlugins, Slot } = ReactPlugin;

  pluginConfigs.forEach(pluginConfig => {
    if (pluginConfig.ui) loadPluginScript(pluginConfig.ui);
  });

  const config = { ...DEFAULT_PLUGIN_CONFIG, ...playgroundConfig };
  loadPlugins({ config });
  ReactDom.render(
    <>
      <GlobalStyle />
      <Slot name="root" />
    </>,
    document.getElementById('root')
  );
}

function loadPluginScript(scriptPath: string) {
  console.log(`[Cosmos] Loading plugin script at ${scriptPath}`);

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = `_plugin/${encodeURIComponent(scriptPath)}`;

  document.getElementsByTagName('head')[0].appendChild(script);
}
