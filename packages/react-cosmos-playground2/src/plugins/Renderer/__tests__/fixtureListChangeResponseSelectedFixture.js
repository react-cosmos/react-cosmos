// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  mockState,
  mockEvent,
  mockCall
} from '../../../testHelpers/plugin';
import {
  mockFixtures,
  mockFixtureState,
  getFxListChangeRes
} from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins({ handleRendererRequest }) {
  register();
  mockState('router', { urlParams: { fixturePath: 'fixtures/zwei.js' } });
  mockEvent('renderer.request', handleRendererRequest);
}

function loadTestPlugins({ fixtureState }) {
  loadPlugins({
    state: {
      renderer: {
        primaryRendererId: 'foo-renderer',
        renderers: {
          'foo-renderer': {
            fixtures: mockFixtures,
            fixtureState
          }
        }
      }
    }
  });
}

it('posts "selectFixture" renderer request', async () => {
  const handleRendererRequest = jest.fn();
  registerTestPlugins({ handleRendererRequest });
  loadTestPlugins({ fixtureState: null });

  mockCall(
    'renderer.receiveResponse',
    getFxListChangeRes('foo-renderer', mockFixtures)
  );

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

it('posts "selectFixture" renderer request with existing fixture state', async () => {
  const handleRendererRequest = jest.fn();
  registerTestPlugins({ handleRendererRequest });
  loadTestPlugins({ fixtureState: mockFixtureState });

  mockCall(
    'renderer.receiveResponse',
    getFxListChangeRes('foo-renderer', mockFixtures)
  );

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'foo-renderer',
        fixturePath: 'fixtures/zwei.js',
        fixtureState: mockFixtureState
      }
    })
  );
});
