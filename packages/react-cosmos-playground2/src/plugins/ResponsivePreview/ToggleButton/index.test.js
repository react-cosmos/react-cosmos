// @flow

import React from 'react';
import { wait, render, cleanup, fireEvent } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PluginProvider } from '../../../plugin';
import { RegisterMethod } from '../../../testHelpers/RegisterMethod';
import { SetPluginState } from '../../../testHelpers/SetPluginState';
import { OnPluginState } from '../../../testHelpers/OnPluginState';
import { DEFAULT_VIEWPORT, getResponsiveViewportStorageKey } from '../shared';

// Plugins have side-effects: they register themselves
import '..';

const storageKey = getResponsiveViewportStorageKey('mockProjectId');

afterEach(cleanup);

it('sets enabled state', async () => {
  const handleSetReponsivePreviewState = jest.fn();
  const { getByText } = renderPlayground(
    <>
      <RegisterMethod methodName="storage.getItem" handler={() => null} />
      <OnPluginState
        pluginName="responsive-preview"
        handler={handleSetReponsivePreviewState}
      />
    </>
  );

  fireEvent.click(getByText(/responsive/i));

  await wait(() =>
    expect(handleSetReponsivePreviewState).lastCalledWith({
      enabled: true,
      viewport: DEFAULT_VIEWPORT
    })
  );
});

it('sets enabled state with stored viewport', async () => {
  const storage = {
    [storageKey]: { width: 420, height: 420 }
  };
  const handleSetReponsivePreviewState = jest.fn();
  const { getByText } = renderPlayground(
    <>
      <RegisterMethod
        methodName="storage.getItem"
        handler={key => Promise.resolve(storage[key])}
      />
      <OnPluginState
        pluginName="responsive-preview"
        handler={handleSetReponsivePreviewState}
      />
    </>
  );

  fireEvent.click(getByText(/responsive/i));

  await wait(() =>
    expect(handleSetReponsivePreviewState).lastCalledWith({
      enabled: true,
      viewport: { width: 420, height: 420 }
    })
  );
});

it('sets disabled state', async () => {
  const handleSetReponsivePreviewState = jest.fn();
  const { getByText } = renderPlayground(
    <>
      <RegisterMethod methodName="storage.getItem" handler={() => null} />
      <OnPluginState
        pluginName="responsive-preview"
        handler={handleSetReponsivePreviewState}
      />
    </>
  );

  const getButton = getByText(/responsive/i);
  fireEvent.click(getButton);
  fireEvent.click(getButton);

  await wait(() =>
    expect(handleSetReponsivePreviewState).lastCalledWith({
      enabled: false,
      viewport: DEFAULT_VIEWPORT
    })
  );
});

it('sets disabled state with stored viewport', async () => {
  const storage = {
    [storageKey]: { width: 420, height: 420 }
  };
  const handleSetReponsivePreviewState = jest.fn();
  const { getByText } = renderPlayground(
    <>
      <RegisterMethod
        methodName="storage.getItem"
        handler={key => Promise.resolve(storage[key])}
      />
      <OnPluginState
        pluginName="responsive-preview"
        handler={handleSetReponsivePreviewState}
      />
    </>
  );

  const getButton = getByText(/responsive/i);
  fireEvent.click(getButton);
  fireEvent.click(getButton);

  await wait(() =>
    expect(handleSetReponsivePreviewState).lastCalledWith({
      enabled: false,
      viewport: { width: 420, height: 420 }
    })
  );
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
      <SetPluginState
        pluginName="responsive-preview"
        value={{ enabled: false, viewport: null }}
      />
      {otherNodes}
    </PluginProvider>
  );
}
