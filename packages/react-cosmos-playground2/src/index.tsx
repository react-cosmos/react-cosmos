import * as React from 'react';
import { render } from 'react-dom';
import * as ReactPlugin from 'react-plugin';
import { getDomContainer } from 'react-cosmos-shared2/dom';
import { CoreSpec } from './plugins/Core/public';
import { GlobalStyle } from './global/style';

// Statefulness alert!
import './global/registerPlugins';

// Config can also contain keys for 3rd party plugins
type Config = {
  core: CoreSpec['config'];
};

// Enable external plugins to use a shared copy of react-plugin. Also enable
// fiddling with plugins from browser console :D.
(window as any).ReactPlugin = ReactPlugin;

export default function mount(config: Config) {
  const { loadPlugins, Slot } = ReactPlugin;

  loadPlugins({ config });
  render(
    <>
      <GlobalStyle />
      <Slot name="root" />
    </>,
    getDomContainer()
  );
}
