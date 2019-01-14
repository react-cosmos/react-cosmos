// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  mockPlugin,
  mockEvent,
  mockEmit,
  getPluginState
} from '../../../testHelpers/plugin';
import { mockFixtures, mockFixtureState } from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

const initialRendererState = {
  primaryRendererId: 'foo-renderer',
  renderers: {
    'foo-renderer': {
      fixtures: mockFixtures,
      fixtureState: mockFixtureState
    },
    'bar-renderer': {
      fixtures: mockFixtures,
      fixtureState: mockFixtureState
    }
  }
};

function registerTestPlugins() {
  register();
  mockPlugin('router');
}

function loadTestPlugins() {
  loadPlugins({ state: { renderer: initialRendererState } });
}

function emitRouterFixtureChange(fixturePath) {
  mockEmit('router.fixtureChange', fixturePath);
}

it('posts "selectFixture" renderer requests', async () => {
  registerTestPlugins();

  const handleRendererRequest = jest.fn();
  mockEvent('renderer.request', handleRendererRequest);

  loadTestPlugins();
  emitRouterFixtureChange('fixtures/zwei.js');

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

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'bar-renderer',
        fixturePath: 'fixtures/zwei.js',
        fixtureState: null
      }
    })
  );
});

it('resets fixture state for all renderers', async () => {
  registerTestPlugins();
  loadTestPlugins();
  emitRouterFixtureChange(undefined);

  await wait(() =>
    expect(getPluginState('renderer')).toEqual({
      primaryRendererId: 'foo-renderer',
      renderers: {
        'foo-renderer': expect.objectContaining({
          fixtureState: null
        }),
        'bar-renderer': expect.objectContaining({
          fixtureState: null
        })
      }
    })
  );
});

it('posts "unselectFixture" renderer requests', async () => {
  registerTestPlugins();

  const handleRendererRequest = jest.fn();
  mockEvent('renderer.request', handleRendererRequest);

  loadTestPlugins();
  emitRouterFixtureChange(undefined);

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'unselectFixture',
      payload: {
        rendererId: 'foo-renderer'
      }
    })
  );

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'unselectFixture',
      payload: {
        rendererId: 'bar-renderer'
      }
    })
  );
});
