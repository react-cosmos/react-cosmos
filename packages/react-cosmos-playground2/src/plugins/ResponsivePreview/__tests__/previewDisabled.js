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

it('renders "rendererPreviewOuter" children', () => {
  const { queryByTestId } = renderPlayground();

  expect(queryByTestId('preview-mock')).toBeTruthy();
});

it('does not render header', () => {
  const { queryByTestId } = renderPlayground();

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
        value={{ enabled: false, viewport: null }}
      />
      {otherNodes}
    </PluginProvider>
  );
}
