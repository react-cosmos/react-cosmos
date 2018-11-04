// @flow

import React from 'react';
import { wait, render, cleanup } from 'react-testing-library';
import { OnRendererRequest } from '../jestHelpers/OnRendererRequest';
import { OnRendererResponse } from '../jestHelpers/OnRendererResponse';
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

  const rendererReqHandler = jest.fn();
  renderPlayground({ rendererReqHandler });

  await wait(() =>
    expect(rendererReqHandler).toBeCalledWith({
      type: 'selectFixture',
      payload: {
        rendererId: 'foo-renderer',
        fixturePath: 'fixtures/zwei.js'
      }
    })
  );
});

it('sends fixtureSelect request on added "fixture" URL param', async () => {
  const rendererReqHandler = jest.fn();
  const rendererResHandler = jest.fn();
  renderPlayground({ rendererReqHandler, rendererResHandler });

  // Wait for fixture list to be received
  await wait(() => expect(rendererResHandler).toBeCalledWith(fixtureListMsg));

  popUrlParams({ fixture: 'fixtures/zwei.js' });

  expect(rendererReqHandler).toBeCalledWith({
    type: 'selectFixture',
    payload: {
      rendererId: 'foo-renderer',
      fixturePath: 'fixtures/zwei.js'
    }
  });
});

it('sends null fixtureSelect request on removed "fixture" URL param', async () => {
  pushUrlParams({ fixture: 'fixtures/zwei.js' });

  const rendererReqHandler = jest.fn();
  const rendererResHandler = jest.fn();
  renderPlayground({ rendererReqHandler, rendererResHandler });

  // Wait for fixture list to be received
  await wait(() => expect(rendererResHandler).toBeCalledWith(fixtureListMsg));

  // This simulation is akin to going back home after selecting a fixture
  popUrlParams({});

  expect(rendererReqHandler).toBeCalledWith({
    type: 'selectFixture',
    payload: {
      rendererId: 'foo-renderer',
      fixturePath: null
    }
  });
});

function renderPlayground({
  rendererReqHandler,
  rendererResHandler = jest.fn()
}: {
  rendererReqHandler: Function,
  rendererResHandler?: Function
}) {
  return render(
    <PlaygroundProvider
      options={{
        rendererUrl: 'foo-renderer'
      }}
    >
      <ReceiveRendererResponse msg={fixtureListMsg} />
      <OnRendererRequest handler={rendererReqHandler} />
      <OnRendererResponse handler={rendererResHandler} />
    </PlaygroundProvider>
  );
}
