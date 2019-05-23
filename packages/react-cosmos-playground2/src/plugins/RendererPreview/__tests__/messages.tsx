import * as React from 'react';
import { wait, render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import * as pluginMocks from '../../../testHelpers/pluginMocks';
import { fakeFetchResponseStatus } from '../testHelpers/fetch';
import { mockIframeMessage, getIframe } from '../testHelpers/iframe';
import { selectFixtureMsg, rendererReadyMsg } from '../testHelpers/messages';
import { register } from '..';

afterEach(cleanup);

function loadTestPlugins() {
  fakeFetchResponseStatus(200);
  loadPlugins();

  return render(<Slot name="rendererPreview" />);
}

function mockCore() {
  pluginMocks.mockCore({
    getWebRendererUrl: () => 'mockRendererUrl'
  });
}

it('posts renderer request message to iframe', async () => {
  register();
  mockCore();
  pluginMocks.mockRendererCore({});

  const renderer = loadTestPlugins();
  pluginMocks.getRendererCoreContext().emit('request', selectFixtureMsg);

  await mockIframeMessage(getIframe(renderer), async ({ onMessage }) => {
    await wait(() =>
      // NOTE: toBeCalledWith doesn't work because trying to compare the
      // message event leads to out of memory errors
      expect(onMessage.mock.calls[0][0].data).toEqual(selectFixtureMsg)
    );
  });
});

it('sends renderer response message to renderer core', async () => {
  register();
  mockCore();

  const receiveResponse = jest.fn();
  pluginMocks.mockRendererCore({
    receiveResponse,
    selectPrimaryRenderer: () => {}
  });

  loadTestPlugins();
  window.postMessage(rendererReadyMsg, '*');

  await wait(() =>
    expect(receiveResponse).toBeCalledWith(expect.any(Object), rendererReadyMsg)
  );
});

it('makes connected renderer the primary renderer', async () => {
  register();
  mockCore();

  const selectPrimaryRenderer = jest.fn();
  pluginMocks.mockRendererCore({
    receiveResponse: () => {},
    selectPrimaryRenderer
  });

  loadTestPlugins();
  window.postMessage(rendererReadyMsg, '*');

  const { rendererId } = rendererReadyMsg.payload;
  await wait(() =>
    expect(selectPrimaryRenderer).toBeCalledWith(expect.any(Object), rendererId)
  );
});
