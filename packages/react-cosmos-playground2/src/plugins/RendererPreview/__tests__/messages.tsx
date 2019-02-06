import * as React from 'react';
import { wait, render } from 'react-testing-library';
import { loadPlugins, Slot, getPluginContext } from 'react-plugin';
import { RendererCoordinatorSpec } from '../../RendererCoordinator/public';
import { cleanup, mockMethodsOf } from '../../../testHelpers/plugin';
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

it('posts renderer request message to iframe', async () => {
  register();

  mockMethodsOf<RendererCoordinatorSpec>('rendererCoordinator', {
    getWebUrl: () => 'mockRendererUrl'
  });

  const renderer = loadTestPlugins();
  getPluginContext<RendererCoordinatorSpec>('rendererCoordinator').emit(
    'request',
    selectFixtureMsg
  );

  await mockIframeMessage(getIframe(renderer), async ({ onMessage }) => {
    await wait(() =>
      // NOTE: toBeCalledWith doesn't work because trying to compare the
      // message event leads to out of memory errors
      expect(onMessage.mock.calls[0][0].data).toEqual(selectFixtureMsg)
    );
  });
});

it('broadcasts renderer response message', async () => {
  register();

  const receiveResponse = jest.fn();
  mockMethodsOf<RendererCoordinatorSpec>('rendererCoordinator', {
    getWebUrl: () => 'mockRendererUrl',
    receiveResponse
  });

  loadTestPlugins();
  window.postMessage(rendererReadyMsg, '*');

  await wait(() =>
    expect(receiveResponse).toBeCalledWith(expect.any(Object), rendererReadyMsg)
  );
});
