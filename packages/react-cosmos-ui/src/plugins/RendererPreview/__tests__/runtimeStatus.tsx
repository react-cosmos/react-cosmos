import { waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';
import { register } from '..';
import {
  getRendererPreviewMethods,
  mockNotifications,
  mockRendererCore,
} from '../../../testHelpers/pluginMocks.js';
import { rendererErrorMsg, rendererReadyMsg } from '../testHelpers/messages.js';

beforeEach(register);

afterEach(resetPlugins);

function registerTestPlugins() {
  mockRendererCore({
    getRendererUrl: () => 'mockRendererUrl',
  });
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="rendererPreview" />);
}

function getRuntimeStatus() {
  const rendererPreview = getRendererPreviewMethods();
  return rendererPreview.getRuntimeStatus();
}

it('sets "error" runtime status', async () => {
  registerTestPlugins();
  mockNotifications();
  loadTestPlugins();

  window.postMessage(rendererErrorMsg, '*');

  await waitFor(() => expect(getRuntimeStatus()).toBe('error'));
});

it('sets "connected" runtime status', async () => {
  registerTestPlugins();
  mockNotifications();
  loadTestPlugins();

  window.postMessage(rendererErrorMsg, '*');
  window.postMessage(rendererReadyMsg, '*');

  await waitFor(() => expect(getRuntimeStatus()).toBe('connected'));
});

it('keeps "connected" runtime status once set', async () => {
  registerTestPlugins();
  mockNotifications();
  loadTestPlugins();

  window.postMessage(rendererReadyMsg, '*');
  window.postMessage(rendererErrorMsg, '*');

  await waitFor(() => expect(getRuntimeStatus()).toBe('connected'));
});

it('shows "renderer error" notification', async () => {
  registerTestPlugins();
  const { pushTimedNotification } = mockNotifications();
  loadTestPlugins();

  window.postMessage(rendererErrorMsg, '*');

  await waitFor(() =>
    expect(pushTimedNotification).toBeCalledWith(expect.any(Object), {
      id: expect.any(String),
      type: 'error',
      title: 'Renderer error',
      info: 'Check the browser console for details.',
    })
  );
});
