import { waitFor } from '@testing-library/dom';
import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';
import { vi } from 'vitest';
import {
  getRendererCoreContext,
  mockNotifications,
  mockRendererCore,
} from '../../../testHelpers/pluginMocks.js';
import { register } from '../index.js';
import { RendererPreviewSpec } from '../spec.js';
import { getIframe } from '../testHelpers/iframe.js';
import { rendererReadyMsg, selectFixtureMsg } from '../testHelpers/messages.js';

beforeEach(register);

afterEach(resetPlugins);

function registerTestPlugins() {
  mockRendererCore({
    getRendererUrl: () => 'http://localhost:5000/_renderer.html',
  });
}

function loadTestPlugins(config?: RendererPreviewSpec['config']) {
  loadPlugins({
    config: { rendererPreview: config ?? {} },
  });
  window.postMessage(rendererReadyMsg, '*');

  return render(<Slot name="rendererPreview" />);
}

async function mockRendererLocation(renderer: RenderResult, newPath: string) {
  Object.defineProperty(window, 'location', {
    value: {
      href: 'http://localhost:5000',
      hostname: 'localhost',
    },
    writable: true,
  });

  const iframe = getIframe(renderer);
  Object.defineProperty(iframe.contentWindow, 'location', {
    value: {
      href: `http://localhost:5000${newPath}`,
      hostname: 'localhost',
      replace: vi.fn(),
    },
    writable: true,
  });
  await fireIframeLoadEvent(iframe);
}

async function fireIframeLoadEvent(iframe: HTMLIFrameElement) {
  act(() => {
    fireEvent.load(iframe);
  });
}

it('renders iframe with src set to renderer web url', async () => {
  registerTestPlugins();
  const renderer = loadTestPlugins();

  await waitFor(() =>
    expect(getIframe(renderer).src).toBe('http://localhost:5000/_renderer.html')
  );
});

it('sets background color of iframe container', async () => {
  registerTestPlugins();
  const renderer = loadTestPlugins({ backgroundColor: 'red' });

  await waitFor(() => {
    const container = getIframe(renderer).parentElement;
    expect(container?.style.getPropertyValue('background-color')).toBe('red');
  });
});

it('shows notification when renderer iframe location changes', async () => {
  registerTestPlugins();
  const { pushStickyNotification } = mockNotifications();
  const renderer = loadTestPlugins();

  await mockRendererLocation(renderer, `/route`);

  expect(pushStickyNotification).toBeCalledWith(expect.any(Object), {
    id: 'renderer-location-change',
    type: 'info',
    title: 'Renderer iframe location changed',
    info: `Select a fixture to reset your preview.`,
  });
});

it('removes location change notification on location revert', async () => {
  registerTestPlugins();
  const { removeStickyNotification } = mockNotifications();
  const renderer = loadTestPlugins();

  await mockRendererLocation(renderer, `/route`);
  await mockRendererLocation(renderer, `/_renderer.html`);

  expect(removeStickyNotification).toBeCalledWith(
    expect.any(Object),
    'renderer-location-change'
  );
});

it('removes location change notification on fixture select', async () => {
  registerTestPlugins();
  const { removeStickyNotification } = mockNotifications();
  const renderer = loadTestPlugins();

  await mockRendererLocation(renderer, `/route`);
  getRendererCoreContext().emit('request', selectFixtureMsg);

  expect(removeStickyNotification).toBeCalledWith(
    expect.any(Object),
    'renderer-location-change'
  );
});

it('resets renderer iframe location on fixture select', async () => {
  registerTestPlugins();
  mockNotifications();
  const renderer = loadTestPlugins();

  await mockRendererLocation(renderer, `/route`);
  getRendererCoreContext().emit('request', selectFixtureMsg);

  const { location } = getIframe(renderer).contentWindow!;
  expect(location.replace).toBeCalledWith(
    `http://localhost:5000/_renderer.html`
  );
});

it('does not show notification when renderer iframe location hash changes', async () => {
  registerTestPlugins();
  const { pushStickyNotification } = mockNotifications();
  const renderer = loadTestPlugins();

  await mockRendererLocation(renderer, `/_renderer.html#/`);

  expect(pushStickyNotification).not.toBeCalled();
});

it('does not show notification when renderer iframe .html extension is stripped', async () => {
  registerTestPlugins();
  const { pushStickyNotification } = mockNotifications();
  const renderer = loadTestPlugins();

  await mockRendererLocation(renderer, `/_renderer`);

  expect(pushStickyNotification).not.toBeCalled();
});
