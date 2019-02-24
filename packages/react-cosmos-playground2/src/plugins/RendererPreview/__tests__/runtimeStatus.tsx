import * as React from 'react';
import { wait, render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { CoreSpec } from '../../Core/public';
import { RendererCoreSpec } from '../../RendererCore/public';
import { cleanup, getState, mockMethodsOf } from '../../../testHelpers/plugin';
import { fakeFetchResponseStatus } from '../testHelpers/fetch';
import { rendererReadyMsg, rendererErrorMsg } from '../testHelpers/messages';
import { RendererPreviewSpec } from '../public';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockMethodsOf<CoreSpec>('core', {
    getWebRendererUrl: () => 'mockRendererUrl'
  });
  mockMethodsOf<RendererCoreSpec>('rendererCore', {
    receiveResponse: () => {},
    selectPrimaryRenderer: () => {}
  });
}

function loadTestPlugins() {
  fakeFetchResponseStatus(200);
  loadPlugins();

  return render(<Slot name="rendererPreview" />);
}

function getRuntimeStatus() {
  return getState<RendererPreviewSpec>('rendererPreview').runtimeStatus;
}

it('sets "error" runtime status', async () => {
  registerTestPlugins();
  loadTestPlugins();

  window.postMessage(rendererErrorMsg, '*');

  await wait(() => expect(getRuntimeStatus()).toBe('error'));
});

it('sets "connected" runtime status', async () => {
  registerTestPlugins();
  loadTestPlugins();

  window.postMessage(rendererErrorMsg, '*');
  window.postMessage(rendererReadyMsg, '*');

  await wait(() => expect(getRuntimeStatus()).toBe('connected'));
});

it('keeps "connected" runtime status once set', async () => {
  registerTestPlugins();
  loadTestPlugins();

  window.postMessage(rendererReadyMsg, '*');
  window.postMessage(rendererErrorMsg, '*');

  await wait(() => expect(getRuntimeStatus()).toBe('connected'));
});
