import { waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';
import {
  getRendererPreviewMethods,
  mockCore,
  mockRendererCore,
} from '../../../testHelpers/pluginMocks';
import { register } from '..';
import { fakeFetchResponseStatus } from '../testHelpers/fetch';
import { rendererErrorMsg, rendererReadyMsg } from '../testHelpers/messages';

beforeEach(register);

afterEach(resetPlugins);

function registerTestPlugins() {
  mockCore({
    getWebRendererUrl: () => 'mockRendererUrl',
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

  await waitFor(() => expect(getRuntimeStatus()).toBe('error'));
});

it('sets "connected" runtime status', async () => {
  registerTestPlugins();
  loadTestPlugins();

  window.postMessage(rendererErrorMsg, '*');
  window.postMessage(rendererReadyMsg, '*');

  await waitFor(() => expect(getRuntimeStatus()).toBe('connected'));
});

it('keeps "connected" runtime status once set', async () => {
  registerTestPlugins();
  loadTestPlugins();

  window.postMessage(rendererReadyMsg, '*');
  window.postMessage(rendererErrorMsg, '*');

  await waitFor(() => expect(getRuntimeStatus()).toBe('connected'));
});
