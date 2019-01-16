/* eslint-env browser */
// @flow

import React from 'react';
import { wait, render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { mockIframeMessage } from '../../../testHelpers/mockIframeMessage';
import {
  cleanup,
  mockConfig,
  mockMethod,
  mockEmit,
  getPluginState
} from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

function fakeSuccessfulFetchCalls() {
  global.fetch = jest.fn(() => Promise.resolve({ status: 200 }));
}

function registerTestPlugins() {
  register();
  mockConfig('renderer', { webUrl: 'mockRendererUrl' });
  mockMethod('renderer.isFixtureLoaded', () => false);
  mockMethod('renderer.hasRendererErrors', () => false);
}

function loadTestPlugins() {
  fakeSuccessfulFetchCalls();
  loadPlugins();

  return render(<Slot name="rendererPreview" />);
}

function getIframe({ getByTestId }) {
  return getByTestId('previewIframe');
}

it('sets "ok" status', async () => {
  registerTestPlugins();
  loadTestPlugins();

  await wait(() =>
    expect(getPluginState('rendererPreview').urlStatus).toBe('ok')
  );
});

it('renders iframe with config.renderer.webUrl src', () => {
  registerTestPlugins();
  const renderer = loadTestPlugins();

  expect(getIframe(renderer).src).toMatch('mockRendererUrl');
});

it(`hides iframe when fixture isn't loaded`, () => {
  registerTestPlugins();
  const renderer = loadTestPlugins();

  expect(getIframe(renderer).style.display).toBe('none');
});

it('posts renderer request message to iframe', async () => {
  registerTestPlugins();
  const renderer = loadTestPlugins();

  const selectFixtureMsg = {
    type: 'selectFixture',
    payload: {
      rendererId: 'foo-renderer',
      fixturePath: 'bar-fixturePath'
    }
  };
  mockEmit('renderer.request', selectFixtureMsg);

  await mockIframeMessage(getIframe(renderer), async ({ onMessage }) => {
    await wait(() =>
      // NOTE: toBeCalledWith doesn't work because trying to compare the
      // message event leads to out of memory errors
      expect(onMessage.mock.calls[0][0].data).toEqual(selectFixtureMsg)
    );
  });
});

const rendererReadyMsg = {
  type: 'rendererReady',
  payload: {
    rendererId: 'foo-renderer',
    fixtures: ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js']
  }
};

it('broadcasts renderer response message', async () => {
  registerTestPlugins();

  const handleReceiveResponse = jest.fn();
  mockMethod('renderer.receiveResponse', handleReceiveResponse);

  loadTestPlugins();
  window.postMessage(rendererReadyMsg, '*');

  await wait(() =>
    expect(handleReceiveResponse).toBeCalledWith(
      expect.any(Object),
      rendererReadyMsg
    )
  );
});

it('stores renderer ID from response message', async () => {
  registerTestPlugins();

  const handleReceiveResponse = jest.fn();
  mockMethod('renderer.receiveResponse', handleReceiveResponse);

  loadTestPlugins();
  window.postMessage(rendererReadyMsg, '*');

  await wait(() =>
    expect(getPluginState('rendererPreview').rendererId).toBe('foo-renderer')
  );
});
