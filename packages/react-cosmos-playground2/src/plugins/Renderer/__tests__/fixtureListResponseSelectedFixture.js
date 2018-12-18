// @flow

import delay from 'delay';
import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  mockState,
  mockEvent,
  mockInitCall
} from '../../../testHelpers/plugin';
import {
  mockFixtureState,
  getFxListRes,
  getRendererState
} from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins({ handleRendererRequest }) {
  register();
  mockState('router', { urlParams: { fixturePath: 'fixtures/zwei.js' } });
  mockEvent('renderer.request', handleRendererRequest);
}

function loadTestPlugins({ rendererState = null } = {}) {
  loadPlugins({ state: { renderer: rendererState } });
}

it('posts "selectFixture" renderer request', async () => {
  const handleRendererRequest = jest.fn();
  registerTestPlugins({ handleRendererRequest });

  mockInitCall('renderer.receiveResponse', getFxListRes('foo-renderer'));

  loadTestPlugins();

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'foo-renderer',
        fixturePath: 'fixtures/zwei.js',
        fixtureState: null
      }
    })
  );
});

it('posts "selectFixture" renderer request with fixture state of primary renderer', async () => {
  const handleRendererRequest = jest.fn();
  registerTestPlugins({ handleRendererRequest });

  mockInitCall('renderer.receiveResponse', getFxListRes('bar-renderer'));

  loadTestPlugins({
    rendererState: {
      primaryRendererId: 'foo-renderer',
      renderers: {
        'foo-renderer': getRendererState({
          fixtureState: mockFixtureState
        })
      }
    }
  });

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'bar-renderer',
        fixturePath: 'fixtures/zwei.js',
        fixtureState: mockFixtureState
      }
    })
  );
});

it('posts only one "selectFixture" renderer request', async () => {
  const handleRendererRequest = jest.fn();
  registerTestPlugins({ handleRendererRequest });

  // The renderer should be requested to load the fixture path from the URL
  // when it broadcasts its fixture list for the first them. But subsequent
  // fixtureList responses shouldn't trigger more selectFixture requests.
  mockInitCall('renderer.receiveResponse', getFxListRes('foo-renderer'));
  mockInitCall('renderer.receiveResponse', getFxListRes('foo-renderer'));

  loadTestPlugins();

  await delay(100);
  expect(handleRendererRequest).toBeCalledTimes(1);
});
