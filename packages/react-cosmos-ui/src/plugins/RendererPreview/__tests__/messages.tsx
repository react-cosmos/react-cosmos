import { waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';
import { register } from '..';
import {
  getRendererCoreContext,
  mockRendererCore,
} from '../../../testHelpers/pluginMocks.js';
import { getIframe, mockIframeMessage } from '../testHelpers/iframe.js';
import { rendererReadyMsg, selectFixtureMsg } from '../testHelpers/messages.js';

beforeEach(register);

afterEach(resetPlugins);

function loadTestPlugins() {
  loadPlugins();
  return render(<Slot name="rendererPreview" />);
}

function mockRendererUrl() {
  return mockRendererCore({
    getRendererUrl: () => 'mockRendererUrl',
  });
}

it('posts renderer request message to iframe', async () => {
  mockRendererUrl();

  const renderer = loadTestPlugins();
  getRendererCoreContext().emit('request', selectFixtureMsg);

  await mockIframeMessage(getIframe(renderer), async ({ onMessage }) => {
    await waitFor(() =>
      // NOTE: toBeCalledWith doesn't work because trying to compare the
      // message event leads to out of memory errors
      expect(onMessage.mock.calls[0][0].data).toEqual(selectFixtureMsg)
    );
  });
});

it('sends renderer response message to renderer core', async () => {
  const { receiveResponse } = mockRendererUrl();

  loadTestPlugins();
  window.postMessage(rendererReadyMsg, '*');

  await waitFor(() =>
    expect(receiveResponse).toBeCalledWith(expect.any(Object), rendererReadyMsg)
  );
});

it('makes connected renderer the primary renderer', async () => {
  const { selectPrimaryRenderer } = mockRendererUrl();

  loadTestPlugins();
  window.postMessage(rendererReadyMsg, '*');

  const { rendererId } = rendererReadyMsg.payload;
  await waitFor(() =>
    expect(selectPrimaryRenderer).toBeCalledWith(expect.any(Object), rendererId)
  );
});
