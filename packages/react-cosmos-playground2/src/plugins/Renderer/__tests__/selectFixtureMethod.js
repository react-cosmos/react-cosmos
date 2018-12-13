// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { cleanup, mockEvent, mockInitCall } from '../../../testHelpers/plugin';
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

it('posts "selectFixture" renderer requests', async () => {
  register();

  const handleRendererRequest = jest.fn();
  mockEvent('renderer.request', handleRendererRequest);

  mockInitCall('renderer.selectFixture', 'fixtures/zwei.js');

  loadPlugins({ state: { renderer: initialRendererState } });

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
