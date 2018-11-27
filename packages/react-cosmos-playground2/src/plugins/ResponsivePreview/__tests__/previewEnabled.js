// @flow

import React from 'react';
import { waitForElement, render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PluginProvider } from '../../../plugin';
import { SetPluginState } from '../../../testHelpers/SetPluginState';

// Plugins have side-effects: they register themselves
import '..';

afterEach(cleanup);

it('renders "rendererPreviewOuter" children', async () => {
  const { getByTestId } = renderPlayground();

  await waitForElement(() => getByTestId('preview-mock'));
});

function renderPlayground(otherNodes) {
  return render(
    <PluginProvider config={{ renderer: { webUrl: 'mockRendererUrl' } }}>
      <Slot name="rendererPreviewOuter">
        <div data-testid="preview-mock" />
      </Slot>
      <SetPluginState
        pluginName="rendererPreview"
        value={{ enabled: true, viewport: { width: 320, height: 480 } }}
      />
      {otherNodes}
    </PluginProvider>
  );
}
