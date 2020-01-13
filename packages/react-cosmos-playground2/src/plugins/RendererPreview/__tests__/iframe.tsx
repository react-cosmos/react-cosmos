import { act, fireEvent, render, wait } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';
import { register } from '..';
import {
  getRendererCoreContext,
  mockCore,
  mockNotifications,
  mockRendererCore
} from '../../../testHelpers/pluginMocks';
import { fakeFetchResponseStatus } from '../testHelpers/fetch';
import { getIframe } from '../testHelpers/iframe';
import { rendererReadyMsg, selectFixtureMsg } from '../testHelpers/messages';

afterEach(resetPlugins);

function registerTestPlugins() {
  register();
  mockCore({
    getWebRendererUrl: () => 'http://localhost:5000/_renderer.html'
  });
  mockRendererCore();
}

function loadTestPlugins() {
  fakeFetchResponseStatus(200);
  loadPlugins();
  window.postMessage(rendererReadyMsg, '*');

  return render(<Slot name="rendererPreview" />);
}

function mockRendererLocation(iframe: HTMLIFrameElement, newPath: string) {
  Object.defineProperty(iframe.contentWindow, 'location', {
    value: { href: `http://localhost:5000${newPath}`, replace: jest.fn() }
  });
}

async function fireIframeLoadEvent(iframe: HTMLIFrameElement) {
  await act(async () => {
    fireEvent.load(iframe);
  });
}

it('renders iframe with src set to renderer web url', async () => {
  registerTestPlugins();
  const renderer = loadTestPlugins();

  await wait(() =>
    expect(getIframe(renderer).src).toBe('http://localhost:5000/_renderer.html')
  );
});

// XXX: For some reason `mockRendererLocation` fails to redefine the location
// of the iframe content window in Node 8
const nodeVersion = parseInt(process.version.substr(1), 10);
if (nodeVersion >= 10) {
  it('shows notification when renderer iframe location changes', async () => {
    registerTestPlugins();
    const { pushStickyNotification } = mockNotifications();
    const renderer = loadTestPlugins();

    mockRendererLocation(getIframe(renderer), `/route`);
    await fireIframeLoadEvent(getIframe(renderer));

    expect(pushStickyNotification).toBeCalledWith(expect.any(Object), {
      id: 'renderer-location-change',
      type: 'info',
      title: 'Renderer iframe location changed',
      info: `Reload or select another fixture to reset your preview.`
    });
  });

  it('removes location change notification on fixture select', async () => {
    registerTestPlugins();
    const { removeStickyNotification } = mockNotifications();
    const renderer = loadTestPlugins();

    mockRendererLocation(getIframe(renderer), `/route`);
    await fireIframeLoadEvent(getIframe(renderer));
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

    mockRendererLocation(getIframe(renderer), `/route`);
    await fireIframeLoadEvent(getIframe(renderer));
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

    mockRendererLocation(getIframe(renderer), `/_renderer.html#/`);
    await fireIframeLoadEvent(getIframe(renderer));

    expect(pushStickyNotification).not.toBeCalled();
  });
}
