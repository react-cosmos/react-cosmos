// @flow
/* eslint-env browser */

import React from 'react';
import { wait, render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup, mockConfig, mockMethod } from '../../../testHelpers/plugin';
import { fakeFetchResponseStatus } from '../testHelpers/fetch';
import { rendererReadyMsg } from '../testHelpers/responses';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockConfig('rendererCoordinator', { webUrl: 'mockRendererUrl' });
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
  registerTestPlugins();
  const renderer = loadTestPlugins();

  await wait(() => expect(getIframe(renderer).src).toMatch('mockRendererUrl'));
});
