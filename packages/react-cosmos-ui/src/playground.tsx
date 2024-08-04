import React from 'react';
import ReactDom from 'react-dom/client';
import * as ReactPlugin from 'react-plugin';
import styled from 'styled-components';
import { PlaygroundMountArgs } from './playgroundConfig.js';
import './plugins/pluginEntry.js';
import { DEFAULT_PLUGIN_CONFIG } from './shared/defaultPluginConfig.js';
import { GlobalStyle } from './style/globalStyle.js';

declare global {
  interface Window {
    ReactPlugin: any;
    React: any;
    ReactDom: any;
    StyledComponents: any;
  }
}

// Enable external plugins to use a shared copy of react-plugin. Also enable
// fiddling with plugins from browser console :D.
window.ReactPlugin = ReactPlugin;
window.React = React;
window.ReactDom = ReactDom;
window.StyledComponents = styled;

export default async function mount({
  playgroundConfig,
  pluginConfigs,
}: PlaygroundMountArgs) {
  const { loadPlugins, Slot } = ReactPlugin;

  // We can make plugin loading unblocking if react-plugin exports the
  // reloadPlugins method.
  await Promise.all(
    pluginConfigs.map(async pluginConfig => {
      if (pluginConfig.ui) await loadPluginScript(pluginConfig.ui);
    })
  );

  const config = { ...DEFAULT_PLUGIN_CONFIG, ...playgroundConfig };
  loadPlugins({ config });

  const root = ReactDom.createRoot(document.getElementById('root')!);
  root.render(
    <>
      <GlobalStyle />
      <Slot name="root" />
    </>
  );
}

async function loadPluginScript(scriptPath: string) {
  console.log(`[Cosmos] Loading plugin script at ${scriptPath}`);
  // Paths are absolute with the dev server, and relative with static
  // exports. Why aren't they always relative? Because in dev mode
  // the plugins could be loaded from folders outside the project rootDir,
  // for example when using a monorepo. In that case relative paths would
  // have to contain "../" segments, which are not allowed in URLs, and
  // for this reason we pass full paths when using the dev server.
  const normalizedPath = scriptPath.startsWith('/')
    ? scriptPath
    : `/${scriptPath}`;

  try {
    await import(/* webpackIgnore: true */ `./_plugin${normalizedPath}`);
  } catch (err) {
    console.log(`[Cosmos] Failed to load plugin script ${scriptPath}`);
    console.log(err);
  }
}
