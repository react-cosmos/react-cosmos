import { waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';
import {
  getRendererPreviewMethods,
  mockCore,
} from '../../../testHelpers/pluginMocks';
import { register } from '..';
import { fakeFetchResponseStatus } from '../testHelpers/fetch';

beforeEach(register);

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
