import 'regenerator-runtime/runtime';
import 'core-js/features/promise';
import 'core-js/features/array/find';
import 'core-js/features/array/includes';
import 'whatwg-fetch';

import React from 'react';
import * as ReactDom from 'react-dom';
import * as ReactPlugin from 'react-plugin';
import { CosmosPluginConfig } from 'react-cosmos-plugin';
import { GlobalStyle } from './global/style';
import { CoreSpec } from './plugins/Core/public';
import { DEFAULT_PLUGIN_CONFIG } from './shared/plugin';

import './plugins/pluginEntry';

declare global {
  interface Window {
    ReactPlugin: typeof ReactPlugin;
    React: typeof React;
    ReactDom: typeof ReactDom;
  }
}

// Config can also contain keys for 3rd party plugins
export type PlaygroundConfig = {
  core: CoreSpec['config'];
  [pluginName: string]: {};
};

// Enable external plugins to use a shared copy of react-plugin. Also enable
// fiddling with plugins from browser console :D.
window.ReactPlugin = ReactPlugin;
window.React = React;
window.ReactDom = ReactDom;

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
    pluginConfig.ui.forEach(scriptPath => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      // TODO: Use localhost/port from Cosmos config
      script.src = `http://localhost:5000/_plugin/${encodeURIComponent(
        scriptPath
      )}`;
      document.getElementsByTagName('head')[0].appendChild(script);
    });
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
