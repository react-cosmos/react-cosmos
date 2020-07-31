import { waitFor } from '@testing-library/dom';
import { act, render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';
import {
  getRendererPreviewMethods,
  mockCore,
} from '../../../testHelpers/pluginMocks';
import { fakeFetchResponseStatus } from '../testHelpers/fetch';

beforeEach(() => jest.isolateModules(() => require('..')));

afterEach(resetPlugins);

function registerTestPlugins() {
  mockCore({
    getWebRendererUrl: () => 'mockRendererUrl',
  });
}

async function loadTestPlugins(status: number) {
  fakeFetchResponseStatus(status);
  // Wait for renderer status to be fetched
  await act(async () => loadPlugins());

  return render(<Slot name="rendererPreview" />);
}

function getUrlStatus() {
  const rendererPreview = getRendererPreviewMethods();
  return rendererPreview.getUrlStatus();
}

it('sets "ok" url status', async () => {
  registerTestPlugins();
  await loadTestPlugins(200);

  await waitFor(() => expect(getUrlStatus()).toBe('ok'));
});

it('sets "notResponding" url status', async () => {
  registerTestPlugins();
  await loadTestPlugins(404);

  await waitFor(() => expect(getUrlStatus()).toBe('error'));
});
