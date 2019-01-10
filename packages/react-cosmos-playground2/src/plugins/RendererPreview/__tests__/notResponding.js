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

function fakeFailedFetchCalls() {
  global.fetch = jest.fn(() => Promise.resolve({ status: 404 }));
}

function registerTestPlugins() {
  register();
  mockConfig('renderer', { webUrl: 'mockRendererUrl' });
  mockMethod('renderer.getPrimaryRendererState', () => null);
}

function loadTestPlugins() {
  fakeFailedFetchCalls();
  loadPlugins();

  return render(<Slot name="rendererPreview" />);
}

it('sets "notResponding" status', async () => {
  registerTestPlugins();
  loadTestPlugins();

  await wait(() =>
    expect(getPluginState('rendererPreview').status).toBe('notResponding')
  );
});
