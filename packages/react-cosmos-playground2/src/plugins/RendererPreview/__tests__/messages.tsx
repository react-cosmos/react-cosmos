import * as React from 'react';
import { wait, render } from 'react-testing-library';
import { loadPlugins, Slot, getPluginContext } from 'react-plugin';
import { CoreSpec } from '../../Core/public';
import { RendererCoreSpec } from '../../RendererCore/public';
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

function mockCore() {
  mockMethodsOf<CoreSpec>('core', {
    getWebRendererUrl: () => 'mockRendererUrl'
  });
}

it('posts renderer request message to iframe', async () => {
  register();
  mockCore();
  mockMethodsOf<RendererCoreSpec>('rendererCore', {});

  const renderer = loadTestPlugins();
  getPluginContext<RendererCoreSpec>('rendererCore').emit(
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

it('sends renderer response message to renderer core', async () => {
  register();
  mockCore();

  const receiveResponse = jest.fn();
  mockMethodsOf<RendererCoreSpec>('rendererCore', {
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
  mockMethodsOf<RendererCoreSpec>('rendererCore', {
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
