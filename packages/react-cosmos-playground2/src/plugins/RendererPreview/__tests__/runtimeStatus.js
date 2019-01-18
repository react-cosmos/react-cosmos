/* eslint-env browser */
// @flow

import React from 'react';
import { wait, render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import {
  cleanup,
  mockConfig,
  mockState,
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
  mockState('router', { urlParams: {} });
  mockMethod('rendererCoordinator.receiveResponse', () => {});
}

function loadTestPlugins() {
  fakeFetchResponseStatus(200);
  loadPlugins();

  return render(<Slot name="rendererPreview" />);
}

it('sets "error" status', async () => {
  registerTestPlugins();
  loadTestPlugins();

  window.postMessage(rendererErrorMsg, '*');

  await wait(() =>
    expect(getPluginState('rendererPreview').runtimeStatus).toBe('error')
  );
});

it('sets "connected" status', async () => {
  registerTestPlugins();
  loadTestPlugins();

  window.postMessage(rendererErrorMsg, '*');
  window.postMessage(rendererReadyMsg, '*');

  await wait(() =>
    expect(getPluginState('rendererPreview').runtimeStatus).toBe('connected')
  );
});

it('keeps "connected" status once set', async () => {
  registerTestPlugins();
  loadTestPlugins();

  window.postMessage(rendererReadyMsg, '*');
  window.postMessage(rendererErrorMsg, '*');

  await wait(() =>
    expect(getPluginState('rendererPreview').runtimeStatus).toBe('connected')
  );
});
