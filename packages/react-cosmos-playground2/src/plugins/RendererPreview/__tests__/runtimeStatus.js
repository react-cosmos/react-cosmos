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
import { fakeFetchResponseStatus } from '../testHelpers/fetch';
import { rendererReadyMsg, rendererErrorMsg } from '../testHelpers/responses';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockConfig('rendererCoordinator', { webUrl: 'mockRendererUrl' });
  mockMethod('rendererCoordinator.receiveResponse', () => {});
}

function loadTestPlugins() {
  fakeFetchResponseStatus(200);
  loadPlugins();

  return render(<Slot name="rendererPreview" />);
}

it('sets "error" runtime status', async () => {
  registerTestPlugins();
  loadTestPlugins();

  window.postMessage(rendererErrorMsg, '*');

  await wait(() =>
    expect(getPluginState('rendererPreview').runtimeStatus).toBe('error')
  );
});

it('sets "connected" runtime status', async () => {
  registerTestPlugins();
  loadTestPlugins();

  window.postMessage(rendererErrorMsg, '*');
  window.postMessage(rendererReadyMsg, '*');

  await wait(() =>
    expect(getPluginState('rendererPreview').runtimeStatus).toBe('connected')
  );
});

it('keeps "connected" runtime status once set', async () => {
  registerTestPlugins();
  loadTestPlugins();

  window.postMessage(rendererReadyMsg, '*');
  window.postMessage(rendererErrorMsg, '*');

  await wait(() =>
    expect(getPluginState('rendererPreview').runtimeStatus).toBe('connected')
  );
});
