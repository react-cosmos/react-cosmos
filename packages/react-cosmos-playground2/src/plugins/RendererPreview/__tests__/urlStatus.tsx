import { waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import React from 'react';
import { getRendererPreviewMethods, mockCore } from 'react-cosmos-shared2/ui';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';
import { fakeFetchResponseStatus } from '../testHelpers/fetch';

beforeEach(() => jest.isolateModules(() => require('..')));

afterEach(resetPlugins);

function registerTestPlugins() {
  mockCore({
    getWebRendererUrl: () => 'mockRendererUrl',
  });
}

function loadTestPlugins(status: number) {
  fakeFetchResponseStatus(status);
  loadPlugins();

  return render(<Slot name="rendererPreview" />);
}

function getUrlStatus() {
  const rendererPreview = getRendererPreviewMethods();
  return rendererPreview.getUrlStatus();
}

it('sets "ok" url status', async () => {
  registerTestPlugins();
  loadTestPlugins(200);

  await waitFor(() => expect(getUrlStatus()).toBe('ok'));
});

it('sets "notResponding" url status', async () => {
  registerTestPlugins();
  loadTestPlugins(404);

  await waitFor(() => expect(getUrlStatus()).toBe('error'));
});
