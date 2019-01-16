/* eslint-env browser */
// @flow

import React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import {
  cleanup,
  mockConfig,
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
  mockConfig('renderer', { webUrl: 'mockRendererUrl' });
}

function loadTestPlugins(rendererId) {
  fakeSuccessfulFetchCalls();
  loadPlugins({ state: { rendererPreview: { urlStatus: 'ok', rendererId } } });

  return render(<Slot name="rendererPreview" />);
}

it('return false when fixture is not loaded nor does the renderer have errors', async () => {
  registerTestPlugins();
  mockMethod('renderer.isFixtureLoaded', () => false);
  mockMethod('renderer.hasRendererErrors', () => false);
  loadTestPlugins('foo-renderer');

  expect(mockCall('rendererPreview.isVisible')).toBe(false);
});

it('return true when fixture is loaded', async () => {
  registerTestPlugins();
  mockMethod('renderer.isFixtureLoaded', () => true);
  loadTestPlugins('foo-renderer');

  expect(mockCall('rendererPreview.isVisible')).toBe(true);
});

it('return true when renderer has errors', async () => {
  registerTestPlugins();
  mockMethod('renderer.isFixtureLoaded', () => false);
  mockMethod('renderer.hasRendererErrors', () => true);
  loadTestPlugins('foo-renderer');

  expect(mockCall('rendererPreview.isVisible')).toBe(true);
});

it('return false when renderer has errors but rendererId is missing', async () => {
  registerTestPlugins();
  mockMethod('renderer.isFixtureLoaded', () => false);
  mockMethod('renderer.hasRendererErrors', () => true);
  loadTestPlugins(null);

  expect(mockCall('rendererPreview.isVisible')).toBe(false);
});
