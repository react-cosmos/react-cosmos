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

function loadTestPlugins({ runtimeError }) {
  fakeSuccessfulFetchCalls();
  loadPlugins({ state: { rendererPreview: { runtimeError } } });

  return render(<Slot name="rendererPreview" />);
}

it('return false', async () => {
  registerTestPlugins();
  mockMethod('renderer.isFixtureLoaded', () => false);
  loadTestPlugins({ runtimeError: false });

  expect(mockCall('rendererPreview.isVisible')).toBe(false);
});

it('return true on loaded fixture', async () => {
  registerTestPlugins();
  mockMethod('renderer.isFixtureLoaded', () => true);
  loadTestPlugins({ runtimeError: false });

  expect(mockCall('rendererPreview.isVisible')).toBe(true);
});

it('return false on runtime error with renderer ready', async () => {
  registerTestPlugins();
  mockMethod('renderer.isReady', () => true);
  mockMethod('renderer.isFixtureLoaded', () => false);
  loadTestPlugins({ runtimeError: true });

  expect(mockCall('rendererPreview.isVisible')).toBe(false);
});

it('return true on runtime error with renderer NOT ready', async () => {
  registerTestPlugins();
  mockMethod('renderer.isReady', () => false);
  mockMethod('renderer.isFixtureLoaded', () => false);
  loadTestPlugins({ runtimeError: true });

  expect(mockCall('rendererPreview.isVisible')).toBe(true);
});
