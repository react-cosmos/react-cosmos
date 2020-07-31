import { waitFor } from '@testing-library/dom';
import { act, render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';
import {
  getRendererPreviewMethods,
  mockCore,
  mockRendererCore,
} from '../../../testHelpers/pluginMocks';
import { fakeFetchResponseStatus } from '../testHelpers/fetch';
import { rendererErrorMsg, rendererReadyMsg } from '../testHelpers/messages';

beforeEach(() => jest.isolateModules(() => require('..')));

afterEach(resetPlugins);

function registerTestPlugins() {
  mockCore({
    getWebRendererUrl: () => 'mockRendererUrl',
  });
  mockRendererCore();
}

async function loadTestPlugins() {
  fakeFetchResponseStatus(200);

  // Wait for renderer status to be fetched
  await act(async () => loadPlugins());

  return render(<Slot name="rendererPreview" />);
}

function getRuntimeStatus() {
  const rendererPreview = getRendererPreviewMethods();
  return rendererPreview.getRuntimeStatus();
}

it('sets "error" runtime status', async () => {
  registerTestPlugins();
  await loadTestPlugins();

  await act(async () => {
    window.postMessage(rendererErrorMsg, '*');

    await waitFor(() => expect(getRuntimeStatus()).toBe('error'));
  });
});

it('sets "connected" runtime status', async () => {
  registerTestPlugins();
  await loadTestPlugins();

  await act(async () => {
    window.postMessage(rendererErrorMsg, '*');
    window.postMessage(rendererReadyMsg, '*');

    await waitFor(() => expect(getRuntimeStatus()).toBe('connected'));
  });
});

it('keeps "connected" runtime status once set', async () => {
  registerTestPlugins();
  await loadTestPlugins();

  await act(async () => {
    window.postMessage(rendererErrorMsg, '*');
    window.postMessage(rendererReadyMsg, '*');

    await waitFor(() => expect(getRuntimeStatus()).toBe('connected'));
  });
});
