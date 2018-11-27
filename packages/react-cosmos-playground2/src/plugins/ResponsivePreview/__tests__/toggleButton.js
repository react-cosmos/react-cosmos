// @flow

import React from 'react';
import { wait, render, cleanup, fireEvent } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PluginProvider } from '../../../plugin';
import { SetPluginState } from '../../../testHelpers/SetPluginState';
import { OnPluginState } from '../../../testHelpers/OnPluginState';
import { DEFAULT_VIEWPORT } from '../shared';

// Plugins have side-effects: they register themselves
import '..';

afterEach(cleanup);

it('sets enabled state', async () => {
  const handleSetReponsivePreviewState = jest.fn();
  const { getByText } = renderPlayground(
    <OnPluginState
      pluginName="responsive-preview"
      handler={handleSetReponsivePreviewState}
    />
  );

  fireEvent.click(getByText(/responsive/i));

  await wait(() =>
    expect(handleSetReponsivePreviewState).toBeCalledWith({
      enabled: true,
      viewport: DEFAULT_VIEWPORT
    })
  );
});

it('sets disabled state', async () => {
  const handleSetReponsivePreviewState = jest.fn();
  const { getByText } = renderPlayground(
    <OnPluginState
      pluginName="responsive-preview"
      handler={handleSetReponsivePreviewState}
    />
  );

  const getButton = getByText(/responsive/i);
  fireEvent.click(getButton);
  fireEvent.click(getButton);

  await wait(() =>
    expect(handleSetReponsivePreviewState).toBeCalledWith({
      enabled: false,
      viewport: null
    })
  );
});

function renderPlayground(otherNodes) {
  return render(
    <PluginProvider config={{ renderer: { webUrl: 'mockRendererUrl' } }}>
      <Slot name="header-buttons" />
      <SetPluginState
        pluginName="responsive-preview"
        value={{ enabled: false, viewport: null }}
      />
      {otherNodes}
    </PluginProvider>
  );
}
