// @flow

import React from 'react';
import { render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PluginProvider } from '../../../plugin';
import { SetPluginState } from '../../../testHelpers/SetPluginState';

// Plugins have side-effects: they register themselves
// "renderer" and "router" states are required for the ResponsivePreview plugin
// to work
import '../../Renderer';
import '../../Router';
import '..';

afterEach(cleanup);

it('does not show button', async () => {
  const { queryByText } = renderPlayground();

  expect(queryByText(/responsive/i)).toBeNull();
});

function renderPlayground(otherNodes) {
  return render(
    <PluginProvider
      config={{
        core: { projectId: 'mockProjectId' },
        renderer: { webUrl: 'mockRendererUrl' }
      }}
    >
      <Slot name="header-buttons" />
      <SetPluginState pluginName="router" value={{ urlParams: {} }} />
      <SetPluginState
        pluginName="responsive-preview"
        value={{ enabled: false, viewport: null }}
      />
      {otherNodes}
    </PluginProvider>
  );
}
