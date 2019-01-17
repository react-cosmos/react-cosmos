// @flow

import React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup, mockConfig, mockState } from '../../../testHelpers/plugin';
import { fakeFetchResponseStatus } from '../testHelpers/fetch';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins(urlParams: {}) {
  register();
  mockConfig('renderer', { webUrl: 'mockRendererUrl' });
  mockState('router', { urlParams });
}

function loadTestPlugins() {
  fakeFetchResponseStatus(200);
  loadPlugins();

  return render(<Slot name="rendererPreview" />);
}

function getIframe({ getByTestId }) {
  return getByTestId('previewIframe');
}

it('renders iframe with config.renderer.webUrl src', () => {
  registerTestPlugins({});
  const renderer = loadTestPlugins();

  expect(getIframe(renderer).src).toMatch('mockRendererUrl');
});

it('shows iframe', () => {
  registerTestPlugins({ fixturePath: 'ein.js' });
  const renderer = loadTestPlugins();

  expect(getIframe(renderer).style.display).toBe('block');
});

it('hides iframe', () => {
  registerTestPlugins({});
  const renderer = loadTestPlugins();

  expect(getIframe(renderer).style.display).toBe('none');
});
