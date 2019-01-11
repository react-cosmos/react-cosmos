/* eslint-env browser */
// @flow

import React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup, mockConfig, mockMethod } from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

function fakeSuccessfulFetchCalls() {
  global.fetch = jest.fn(() => Promise.resolve({ status: 200 }));
}

function registerTestPlugins() {
  register();
  mockConfig('renderer', { webUrl: 'mockRendererUrl' });
  mockMethod('renderer.isFixtureLoaded', () => true);
}

function loadTestPlugins() {
  fakeSuccessfulFetchCalls();
  loadPlugins();

  return render(<Slot name="rendererPreview" />);
}

function getIframe({ getByTestId }) {
  return getByTestId('previewIframe');
}

it('shows iframe when fixture is loaded', () => {
  registerTestPlugins();
  const renderer = loadTestPlugins();

  expect(getIframe(renderer).style.display).toBe('block');
});
