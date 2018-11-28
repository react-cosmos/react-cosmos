// @flow

import React from 'react';
import { render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PluginProvider } from '../../../plugin';
import { SetPluginState } from '../../../testHelpers/SetPluginState';

// Plugins have side-effects: they register themselves
// "router" state is required for the ResponsivePreview plugin to work
import '../../Router';
import '..';

afterEach(cleanup);

it('renders children of "rendererPreviewOuter" slot', () => {
  const { queryByTestId } = renderPlayground();

  expect(queryByTestId('preview-mock')).toBeTruthy();
});

it('renders responsive header', () => {
  const { queryByTestId } = renderPlayground();

  expect(queryByTestId('responsive-header')).toBeTruthy();
});

it('does not render responsive header in full screen mode', () => {
  const { queryByTestId } = renderPlayground(
    <SetPluginState
      pluginName="router"
      value={{ urlParams: { fullScreen: true } }}
    />
  );

  expect(queryByTestId('responsive-header')).toBeNull();
});

function renderPlayground(otherNodes) {
  return render(
    <PluginProvider config={{ renderer: { webUrl: 'mockRendererUrl' } }}>
      <Slot name="rendererPreviewOuter">
        <div data-testid="preview-mock" />
      </Slot>
      <SetPluginState
        pluginName="responsive-preview"
        value={{ enabled: true, viewport: { width: 320, height: 480 } }}
      />
      {otherNodes}
    </PluginProvider>
  );
}
