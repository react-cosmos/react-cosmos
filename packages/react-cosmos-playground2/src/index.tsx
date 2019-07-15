import React from 'react';
import { render } from 'react-dom';
import * as ReactPlugin from 'react-plugin';
import { CoreSpec } from './plugins/Core/public';
import { GlobalStyle } from './global/style';

// Statefulness alert!
import './global/registerPlugins';

// Config can also contain keys for 3rd party plugins
export type PlaygroundConfig = {
  core: CoreSpec['config'];
  [pluginName: string]: {};
};

// Enable external plugins to use a shared copy of react-plugin. Also enable
// fiddling with plugins from browser console :D.
(window as any).ReactPlugin = ReactPlugin;

const DEFAULT_CONFIG = {
  core: {
    globalOrder: ['fixtureSearch']
  },
  nav: {
    navRowOrder: ['fixtureSearch', 'fixtureTree']
  },
  rendererHeader: {
    rendererActionOrder: [
      'remoteRenderer',
      'fullScreen',
      'responsivePreview',
      'controlPanel'
    ]
  },
  controlPanel: {
    controlPanelRowOrder: ['props', 'classState']
  }
};

export default function mount(userConfig: PlaygroundConfig) {
  const { loadPlugins, Slot } = ReactPlugin;

  const config = { ...DEFAULT_CONFIG, ...userConfig };
  loadPlugins({ config });
  render(
    <>
      <GlobalStyle />
      <Slot name="root" />
    </>,
    document.getElementById('root')
  );
}
