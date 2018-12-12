/* eslint-env browser */
// @flow

import React from 'react';
import { wait, render } from 'react-testing-library';
import { registerPlugin, loadPlugins, Slot } from 'react-plugin';
import { mockIframeMessage } from '../../testHelpers/mockIframeMessage';
import { cleanup, mockMethod } from '../../testHelpers/plugin';
import { register } from '.';

afterEach(cleanup);

it('renders iframe with config.renderer.webUrl src', () => {
  const renderer = loadTestPlugins(() => {
    registerPlugin({ name: 'renderer' });
  });

  expect(getIframe(renderer).src).toMatch('mockRendererUrl');
});

it('posts renderer request message to iframe', async () => {
  const selectFixtureMsg = {
    type: 'selectFixture',
    payload: {
      rendererId: 'foo-renderer',
      fixturePath: 'bar-fixturePath'
    }
  };

  const renderer = loadTestPlugins(() => {
    registerPlugin({ name: 'renderer' }).init(({ emitEvent }) => {
      // Wait for iframe ref to be received
      setTimeout(() => {
        emitEvent('request', selectFixtureMsg);
      });
    });
  });

  await mockIframeMessage(getIframe(renderer), async ({ onMessage }) => {
    await wait(() =>
      // NOTE: toBeCalledWith doesn't work because trying to compare the
      // message event leads to out of memory errors
      expect(onMessage.mock.calls[0][0].data).toEqual(selectFixtureMsg)
    );
  });
});

it('broadcasts renderer response message from iframe', async () => {
  const fixtureListMsg = {
    type: 'fixtureList',
    payload: {
      rendererId: 'foo-renderer',
      fixtures: ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js']
    }
  };
  const handleReceiveResponse = jest.fn();

  loadTestPlugins(() => {
    mockMethod('renderer.receiveResponse', handleReceiveResponse);
  });

  window.postMessage(fixtureListMsg, '*');

  await wait(() =>
    expect(handleReceiveResponse).toBeCalledWith(
      expect.any(Object),
      fixtureListMsg
    )
  );
});

function loadTestPlugins(extraSetup = () => {}) {
  register();
  extraSetup();
  loadPlugins({ config: { renderer: { webUrl: 'mockRendererUrl' } } });

  return render(<Slot name="rendererPreview" />);
}

function getIframe({ getByTestId }) {
  return getByTestId('preview-iframe');
}
