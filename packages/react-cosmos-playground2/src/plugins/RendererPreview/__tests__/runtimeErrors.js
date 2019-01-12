/* eslint-env browser */
// @flow

import React from 'react';
import { wait, render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import {
  cleanup,
  mockConfig,
  mockMethod,
  getPluginState
} from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

function fakeSuccessfulFetchCalls() {
  global.fetch = jest.fn(() => Promise.resolve({ status: 200 }));
}

function registerTestPlugins() {
  register();
  mockConfig('renderer', { webUrl: 'mockRendererUrl' });
  mockMethod('renderer.isFixtureLoaded', () => false);
  mockMethod('renderer.receiveResponse', () => {});
}

function loadTestPlugins() {
  fakeSuccessfulFetchCalls();
  loadPlugins();

  return render(<Slot name="rendererPreview" />);
}

function triggerRuntimeError() {
  // This is a global handler exposed for alien renderer code (from inside the
  // preview iframe) to call when it captures an unhandled exception
  window.onRendererRuntimeError();
}

it('sets runtime error state flag', async () => {
  registerTestPlugins();
  loadTestPlugins();
  triggerRuntimeError();

  await wait(() =>
    expect(getPluginState('rendererPreview').runtimeError).toBe(true)
  );
});

it('resets runtime error state flag', async () => {
  registerTestPlugins();
  loadTestPlugins();
  triggerRuntimeError();

  // A message from the renderers indicatesthat the renderer error has been
  // resolved (probably due to "hot module reloading")
  const rendererReadyMsg = {
    type: 'rendererReady',
    payload: {
      rendererId: 'foo-renderer',
      fixtures: []
    }
  };
  window.postMessage(rendererReadyMsg, '*');

  await wait(() =>
    expect(getPluginState('rendererPreview').runtimeError).toBe(false)
  );
});
