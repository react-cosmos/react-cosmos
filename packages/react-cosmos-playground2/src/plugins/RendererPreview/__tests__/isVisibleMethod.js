/* eslint-env browser */
// @flow

import React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import {
  cleanup,
  mockConfig,
  mockState,
  mockMethod,
  mockCall
} from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

function fakeSuccessfulFetchCalls() {
  global.fetch = jest.fn(() => Promise.resolve({ status: 200 }));
}

function registerTestPlugins() {
  register();
  mockState('router', { urlParams: {} });
  mockConfig('renderer', { webUrl: 'mockRendererUrl' });
}

function loadTestPlugins({ rendererId }) {
  fakeSuccessfulFetchCalls();
  loadPlugins({ state: { rendererPreview: { urlStatus: 'ok', rendererId } } });

  return render(<Slot name="rendererPreview" />);
}

it('return false when fixture is not loaded nor the renderer broken', async () => {
  registerTestPlugins();
  mockMethod('renderer.isFixtureLoaded', () => false);
  mockMethod('renderer.isRendererBroken', () => false);
  loadTestPlugins({ rendererId: 'foo-renderer' });

  expect(mockCall('rendererPreview.isVisible')).toBe(false);
});

it('return true when fixture is loaded', async () => {
  registerTestPlugins();
  mockMethod('renderer.isFixtureLoaded', () => true);
  loadTestPlugins({ rendererId: 'foo-renderer' });

  expect(mockCall('rendererPreview.isVisible')).toBe(true);
});

it('return true when renderer is broken', async () => {
  registerTestPlugins();
  mockMethod('renderer.isFixtureLoaded', () => false);
  mockMethod('renderer.isRendererBroken', () => true);
  loadTestPlugins({ rendererId: 'foo-renderer' });

  expect(mockCall('rendererPreview.isVisible')).toBe(true);
});

it('return false when renderer is broken but rendererId is missing', async () => {
  registerTestPlugins();
  mockMethod('renderer.isFixtureLoaded', () => false);
  mockMethod('renderer.isRendererBroken', () => true);
  loadTestPlugins({ rendererId: null });

  expect(mockCall('rendererPreview.isVisible')).toBe(false);
});
