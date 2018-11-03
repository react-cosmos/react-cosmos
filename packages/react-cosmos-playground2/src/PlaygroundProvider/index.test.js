// @flow

import React from 'react';
import { wait, render, cleanup } from 'react-testing-library';
import { RENDERER_ID } from 'react-cosmos-shared2/renderer';
import { OnRendererRequest } from '../jestHelpers/OnRendererRequest';
import { ReceiveRendererResponse } from '../jestHelpers/ReceiveRendererResponse';
import { pushUrlParams, popUrlParams, resetUrl } from '../jestHelpers/url';
import { PlaygroundProvider } from '.';

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

it('sends fixtureSelect request on initial "fixture" URL param', async () => {
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

it('sends fixtureSelect request on "fixture" URL param', async () => {
  const rendererRequestHandler = jest.fn();
  renderPlayground({ rendererRequestHandler });

  popUrlParams({ fixture: 'fixtures/zwei.js' });

  expect(rendererRequestHandler).toBeCalledWith({
    type: 'selectFixture',
    payload: {
      rendererId: RENDERER_ID,
      fixturePath: 'fixtures/zwei.js'
    }
  });
});

it('sends null fixtureSelect request on removed "fixture" URL param', async () => {
  pushUrlParams({ fixture: 'fixtures/zwei.js' });

  const rendererRequestHandler = jest.fn();
  renderPlayground({ rendererRequestHandler });

  // This simulation is akin to going back home after selecting a fixture
  popUrlParams({});

  expect(rendererRequestHandler).toBeCalledWith({
    type: 'selectFixture',
    payload: {
      rendererId: RENDERER_ID,
      fixturePath: null
    }
  });
});

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
