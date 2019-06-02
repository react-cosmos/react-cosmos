import React from 'react';
import { wait, render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import {
  mockCore,
  getRendererPreviewMethods
} from '../../../testHelpers/pluginMocks';
import { fakeFetchResponseStatus } from '../testHelpers/fetch';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockCore({
    getWebRendererUrl: () => 'mockRendererUrl'
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

  await wait(() => expect(getUrlStatus()).toBe('ok'));
});

it('sets "notResponding" url status', async () => {
  registerTestPlugins();
  loadTestPlugins(404);

  await wait(() => expect(getUrlStatus()).toBe('error'));
});
