// @flow

import React from 'react';
import { wait, render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import {
  cleanup,
  mockConfig,
  getPluginState
} from '../../../testHelpers/plugin';
import { fakeFetchResponseStatus } from '../testHelpers/fetch';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockConfig('rendererCoordinator', { webUrl: 'mockRendererUrl' });
}

function loadTestPlugins(status: number) {
  fakeFetchResponseStatus(status);
  loadPlugins();

  return render(<Slot name="rendererPreview" />);
}

it('sets "ok" url status', async () => {
  registerTestPlugins();
  loadTestPlugins(200);

  await wait(() =>
    expect(getPluginState('rendererPreview').urlStatus).toBe('ok')
  );
});

it('sets "notResponding" url status', async () => {
  registerTestPlugins();
  loadTestPlugins(404);

  await wait(() =>
    expect(getPluginState('rendererPreview').urlStatus).toBe('error')
  );
});
