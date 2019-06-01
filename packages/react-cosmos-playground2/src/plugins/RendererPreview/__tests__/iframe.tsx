import * as React from 'react';
import { wait, render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import { mockCore, mockRendererCore } from '../../../testHelpers/pluginMocks';
import { fakeFetchResponseStatus } from '../testHelpers/fetch';
import { rendererReadyMsg } from '../testHelpers/messages';
import { getIframe } from '../testHelpers/iframe';
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
  window.postMessage(rendererReadyMsg, '*');

  return render(<Slot name="rendererPreview" />);
}

it('renders iframe with src set to renderer web url', async () => {
  registerTestPlugins();
  const renderer = loadTestPlugins();

  await wait(() => expect(getIframe(renderer).src).toMatch('mockRendererUrl'));
});
