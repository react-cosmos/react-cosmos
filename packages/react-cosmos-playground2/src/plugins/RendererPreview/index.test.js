/* eslint-env browser */
// @flow

import React from 'react';
import { wait, render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { mockIframeMessage } from '../../testHelpers/mockIframeMessage';
import {
  cleanup,
  mockConfig,
  mockMethod,
  mockInit
} from '../../testHelpers/plugin';
import { register } from '.';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockConfig('renderer', { webUrl: 'mockRendererUrl' });
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="rendererPreview" />);
}

function getIframe({ getByTestId }) {
  return getByTestId('previewIframe');
}

it('renders iframe with config.renderer.webUrl src', () => {
  registerTestPlugins();
  const renderer = loadTestPlugins();

  expect(getIframe(renderer).src).toMatch('mockRendererUrl');
});

it('posts renderer request message to iframe', async () => {
  registerTestPlugins();

  const selectFixtureMsg = {
    type: 'selectFixture',
    payload: {
      rendererId: 'foo-renderer',
      fixturePath: 'bar-fixturePath'
    }
  };
  mockInit('renderer', ({ emitEvent }) => {
    // Wait for iframe ref to be received
    setTimeout(() => {
      emitEvent('request', selectFixtureMsg);
    });
  });

  const renderer = loadTestPlugins();

  await mockIframeMessage(getIframe(renderer), async ({ onMessage }) => {
    await wait(() =>
      // NOTE: toBeCalledWith doesn't work because trying to compare the
      // message event leads to out of memory errors
      expect(onMessage.mock.calls[0][0].data).toEqual(selectFixtureMsg)
    );
  });
});

it('broadcasts renderer response message from iframe', async () => {
  registerTestPlugins();

  const handleReceiveResponse = jest.fn();
  mockMethod('renderer.receiveResponse', handleReceiveResponse);

  loadTestPlugins();

  const fixtureListMsg = {
    type: 'fixtureList',
    payload: {
      rendererId: 'foo-renderer',
      fixtures: ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js']
    }
  };
  window.postMessage(fixtureListMsg, '*');

  await wait(() =>
    expect(handleReceiveResponse).toBeCalledWith(
      expect.any(Object),
      fixtureListMsg
    )
  );
});
