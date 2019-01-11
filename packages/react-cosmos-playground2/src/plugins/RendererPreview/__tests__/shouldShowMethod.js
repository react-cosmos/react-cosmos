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

function registerTestPlugins({ isFixtureLoaded }) {
  register();
  mockConfig('renderer', { webUrl: 'mockRendererUrl' });
  mockMethod('renderer.isFixtureLoaded', () => isFixtureLoaded);
}

function loadTestPlugins({ runtimeError }) {
  fakeSuccessfulFetchCalls();
  loadPlugins({ state: { rendererPreview: { runtimeError } } });

  return render(<Slot name="rendererPreview" />);
}

it('return false', async () => {
  registerTestPlugins({ isFixtureLoaded: false });
  loadTestPlugins({ runtimeError: false });

  expect(mockCall('rendererPreview.shouldShow')).toBe(false);
});

it('return true on loaded fixture', async () => {
  registerTestPlugins({ isFixtureLoaded: true });
  loadTestPlugins({ runtimeError: false });

  expect(mockCall('rendererPreview.shouldShow')).toBe(true);
});

it('return true on runtime error', async () => {
  registerTestPlugins({ isFixtureLoaded: false });
  loadTestPlugins({ runtimeError: true });

  expect(mockCall('rendererPreview.shouldShow')).toBe(true);
});
