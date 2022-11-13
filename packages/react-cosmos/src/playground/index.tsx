import React from 'react';
import ReactDom from 'react-dom';
import * as ReactPlugin from 'react-plugin';
import { CosmosPluginConfig } from '../server/cosmosPlugin/types';
import { CoreSpec } from './plugins/Core/spec';
import './plugins/pluginEntry';
import { DEFAULT_PLUGIN_CONFIG } from './shared/defaultPluginConfig';
import { GlobalStyle } from './style/globalStyle';

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

export default async function mount({
  playgroundConfig,
  pluginConfigs,
}: PlaygroundMountArgs) {
  const { loadPlugins, Slot } = ReactPlugin;

  const config = { ...DEFAULT_PLUGIN_CONFIG, ...playgroundConfig };
  loadPlugins({ config });

  // We can make plugin loading unblocking if react-plugin exports the
  // reloadPlugins method.
  await Promise.all(
    pluginConfigs.map(async pluginConfig => {
      if (pluginConfig.ui) await loadPluginScript(pluginConfig.ui);
    })
  );

  ReactDom.render(
    <>
      <GlobalStyle />
      <Slot name="root" />
    </>,
    document.getElementById('root')
  );
}

async function loadPluginScript(scriptPath: string) {
  console.log(`[Cosmos] Loading plugin script at ${scriptPath}`);

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = `_plugin/${encodeURIComponent(scriptPath)}`;

  document.getElementsByTagName('head')[0].appendChild(script);

  return new Promise(resolve => {
    script.onload = resolve;
  });
}
