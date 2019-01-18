// @flow

import React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup, mockConfig, mockState } from '../../../testHelpers/plugin';
import { fakeFetchResponseStatus } from '../testHelpers/fetch';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockConfig('rendererCoordinator', { webUrl: 'mockRendererUrl' });
  mockState('router', { urlParams: { fixturePath: 'ein.js' } });
}

function loadTestPlugins() {
  fakeFetchResponseStatus(200);
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
