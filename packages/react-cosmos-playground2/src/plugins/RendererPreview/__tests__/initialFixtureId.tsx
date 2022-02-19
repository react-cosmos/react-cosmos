import { waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import React from 'react';
import { RendererReadyResponse } from 'react-cosmos-shared2/renderer';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';
import {
  mockCore,
  mockRendererCore,
  mockRouter,
} from '../../../testHelpers/pluginMocks';
import { fakeFetchResponseStatus } from '../testHelpers/fetch';
import { rendererReadyMsg } from '../testHelpers/messages';

beforeEach(() => jest.isolateModules(() => require('..')));

afterEach(resetPlugins);

function loadTestPlugins() {
  fakeFetchResponseStatus(200);
  loadPlugins();
  return render(<Slot name="rendererPreview" />);
}

function mockRendererUrl() {
  mockCore({
    getWebRendererUrl: () => 'mockRendererUrl',
  });
}

it('sends renderer response message to renderer core', async () => {
  mockRendererUrl();
  const { selectFixture } = mockRouter();
  mockRendererCore();

  loadTestPlugins();
  const msg: RendererReadyResponse = {
    ...rendererReadyMsg,
    payload: {
      ...rendererReadyMsg.payload,
      initialFixtureId: { path: 'ein.js' },
    },
  };
  window.postMessage(msg, '*');

  await waitFor(() =>
    expect(selectFixture).toBeCalledWith(expect.any(Object), { path: 'ein.js' })
  );
});
