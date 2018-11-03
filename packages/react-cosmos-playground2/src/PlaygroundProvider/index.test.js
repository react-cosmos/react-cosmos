// @flow
/* eslint-env browser */

import React from 'react';
import qs from 'query-string';
import { wait, render, cleanup } from 'react-testing-library';
import { RENDERER_ID } from 'react-cosmos-shared2/renderer';
import { OnRendererRequest } from '../jestHelpers/OnRendererRequest';
import { ReceiveRendererResponse } from '../jestHelpers/ReceiveRendererResponse';
import { PlaygroundProvider } from '.';

import type { UrlParams } from '../index.js.flow';

afterEach(() => {
  cleanup();
  resetUrl();
});

const fixtureListMsg = {
  type: 'fixtureList',
  payload: {
    rendererId: 'foo-renderer',
    fixtures: ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js']
  }
};

it('sends fixtureSelect request on initial urlParams.fixture', async () => {
  pushUrlParams({ fixture: 'fixtures/zwei.js' });

  const rendererRequestHandler = jest.fn();
  renderPlayground({ rendererRequestHandler });

  await wait(() =>
    expect(rendererRequestHandler).toBeCalledWith({
      type: 'selectFixture',
      payload: {
        rendererId: RENDERER_ID,
        fixturePath: 'fixtures/zwei.js'
      }
    })
  );
});

it('sends fixtureSelect request on urlParams.fixture change', async () => {
  const rendererRequestHandler = jest.fn();
  renderPlayground({ rendererRequestHandler });

  pushUrlParams({ fixture: 'fixtures/zwei.js' });
  // Simulate `popstate` event, like using back/fwd browser buttons
  window.dispatchEvent(new Event('popstate'));

  expect(rendererRequestHandler).toBeCalledWith({
    type: 'selectFixture',
    payload: {
      rendererId: RENDERER_ID,
      fixturePath: 'fixtures/zwei.js'
    }
  });
});

// TODO: Test fixturePath: null

function renderPlayground({ rendererRequestHandler }) {
  return render(
    <PlaygroundProvider
      options={{
        rendererUrl: 'foo-renderer'
      }}
    >
      <ReceiveRendererResponse msg={fixtureListMsg} />
      <OnRendererRequest handler={rendererRequestHandler} />
    </PlaygroundProvider>
  );
}

function pushUrlParams(params: UrlParams) {
  const query = qs.stringify(params);
  history.pushState({}, '', `?${query}`);
}

function resetUrl() {
  pushUrlParams({});
}
