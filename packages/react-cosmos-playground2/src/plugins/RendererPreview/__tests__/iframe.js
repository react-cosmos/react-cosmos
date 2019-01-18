// @flow
/* eslint-env browser */

import React from 'react';
import { wait, render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import {
  cleanup,
  mockConfig,
  mockState,
  mockMethod
} from '../../../testHelpers/plugin';
import { fakeFetchResponseStatus } from '../testHelpers/fetch';
import { rendererReadyMsg } from '../testHelpers/responses';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins(urlParams: {}) {
  register();
  mockConfig('rendererCoordinator', { webUrl: 'mockRendererUrl' });
  mockState('router', { urlParams });
  mockMethod('rendererCoordinator.receiveResponse', () => {});
}

function loadTestPlugins() {
  fakeFetchResponseStatus(200);
  loadPlugins();
  window.postMessage(rendererReadyMsg, '*');

  return render(<Slot name="rendererPreview" />);
}

function getIframe({ getByTestId }) {
  return getByTestId('previewIframe');
}

it('renders iframe with config.renderer.webUrl src', async () => {
  registerTestPlugins({});
  const renderer = loadTestPlugins();

  await wait(() => expect(getIframe(renderer).src).toMatch('mockRendererUrl'));
});

it('shows iframe when fixture is selected', async () => {
  registerTestPlugins({ fixturePath: 'ein.js' });
  const renderer = loadTestPlugins();

  await wait(() => expect(getIframe(renderer).style.display).toBe('block'));
});

it('hides iframe when fixture is not selected', async () => {
  registerTestPlugins({});
  const renderer = loadTestPlugins();

  await wait(() => expect(getIframe(renderer).style.display).toBe('none'));
});
