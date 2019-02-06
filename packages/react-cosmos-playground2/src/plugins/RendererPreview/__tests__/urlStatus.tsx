import * as React from 'react';
import { wait, render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { RendererCoordinatorSpec } from '../../RendererCoordinator/public';
import { cleanup, getState, mockMethodsOf } from '../../../testHelpers/plugin';
import { fakeFetchResponseStatus } from '../testHelpers/fetch';
import { RendererPreviewSpec } from '../public';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockMethodsOf<RendererCoordinatorSpec>('rendererCoordinator', {
    getWebUrl: () => 'mockRendererUrl'
  });
}

function loadTestPlugins(status: number) {
  fakeFetchResponseStatus(status);
  loadPlugins();

  return render(<Slot name="rendererPreview" />);
}

function getUrlStatus() {
  return getState<RendererPreviewSpec>('rendererPreview').urlStatus;
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
