// @flow

import React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import {
  cleanup,
  mockConfig,
  mockState,
  mockCall
} from '../../../testHelpers/plugin';
import { fakeFetchResponseStatus } from '../testHelpers/fetch';
import { register } from '..';

import type { RuntimeStatus } from '../shared';

afterEach(cleanup);

function registerTestPlugins(urlParams: {}) {
  register();
  mockConfig('rendererCoordinator', { webUrl: 'mockRendererUrl' });
  mockState('router', { urlParams });
}

function loadTestPlugins(runtimeStatus: RuntimeStatus) {
  loadPlugins({
    state: { rendererPreview: { urlStatus: 'unknown', runtimeStatus } }
  });

  return render(<Slot name="rendererPreview" />);
}

describe('URL OK', () => {
  beforeEach(() => {
    fakeFetchResponseStatus(200);
  });

  it('return false when fixture is not selected and renderer is connected', async () => {
    registerTestPlugins({});
    loadTestPlugins('connected');

    expect(mockCall('rendererPreview.isVisible')).toBe(false);
  });

  it('return true when fixture is selected', async () => {
    registerTestPlugins({ fixturePath: 'ein.js' });
    loadTestPlugins('connected');

    expect(mockCall('rendererPreview.isVisible')).toBe(true);
  });

  it('return true when renderer has errors', async () => {
    registerTestPlugins({});
    loadTestPlugins('error');

    expect(mockCall('rendererPreview.isVisible')).toBe(true);
  });

  it('return true when fixture is selected and renderer has error', async () => {
    registerTestPlugins({ fixturePath: 'ein.js' });
    loadTestPlugins('error');

    expect(mockCall('rendererPreview.isVisible')).toBe(true);
  });
});

describe('URL not responding', () => {
  beforeEach(() => {
    fakeFetchResponseStatus(404);
  });

  it('return false', async () => {
    registerTestPlugins({ fixturePath: 'ein.js' });
    loadTestPlugins('pending');

    expect(mockCall('rendererPreview.isVisible')).toBe(false);
  });
});
