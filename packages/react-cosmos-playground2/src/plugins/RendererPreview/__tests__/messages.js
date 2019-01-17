/* eslint-env browser */
// @flow

import React from 'react';
import { wait, render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { mockIframeMessage } from '../testHelpers/mockIframeMessage';
import {
  cleanup,
  mockConfig,
  mockState,
  mockMethod,
  mockEmit
} from '../../../testHelpers/plugin';
import { fakeFetchResponseStatus } from '../testHelpers/fetch';
import { register } from '..';

import type { SelectFixtureRequest } from 'react-cosmos-shared2/renderer';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockConfig('renderer', { webUrl: 'mockRendererUrl' });
  mockState('router', { urlParams: {} });
}

function loadTestPlugins() {
  fakeFetchResponseStatus(200);
  loadPlugins();

  return render(<Slot name="rendererPreview" />);
}

function getIframe({ getByTestId }) {
  return getByTestId('previewIframe');
}

it('posts renderer request message to iframe', async () => {
  registerTestPlugins();
  const renderer = loadTestPlugins();

  const selectFixtureMsg: SelectFixtureRequest = {
    type: 'selectFixture',
    payload: {
      rendererId: 'mockRendererId',
      fixturePath: 'mockFixturePath',
      fixtureState: null
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
    rendererId: 'mockRendererId',
    fixtures: ['ein.js', 'zwei.js', 'drei.js']
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
