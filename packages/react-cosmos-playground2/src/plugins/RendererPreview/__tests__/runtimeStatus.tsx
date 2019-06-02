import React from 'react';
import { wait, render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import {
  mockCore,
  mockRendererCore,
  getRendererPreviewMethods
} from '../../../testHelpers/pluginMocks';
import { fakeFetchResponseStatus } from '../testHelpers/fetch';
import { rendererReadyMsg, rendererErrorMsg } from '../testHelpers/messages';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockCore({
    getWebRendererUrl: () => 'mockRendererUrl'
  });
  mockRendererCore();
}

function loadTestPlugins() {
  fakeFetchResponseStatus(200);
  loadPlugins();

  return render(<Slot name="rendererPreview" />);
}

function getRuntimeStatus() {
  const rendererPreview = getRendererPreviewMethods();
  return rendererPreview.getRuntimeStatus();
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
