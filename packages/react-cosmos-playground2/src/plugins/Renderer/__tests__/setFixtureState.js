// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  getPluginState,
  mockState,
  mockEvent,
  mockCall
} from '../../../testHelpers/plugin';
import { register } from '..';

import type { RendererCoordinatorState } from '..';

afterEach(cleanup);

const rendererState: RendererCoordinatorState = {
  connectedRendererIds: ['mockRendererId1', 'mockRendererId2'],
  primaryRendererId: 'mockRendererId1',
  fixtures: ['ein.js', 'zwei.js', 'drei.js'],
  fixtureState: { components: [] }
};
const expectedFixtureState = {
  components: [],
  viewport: { width: 640, height: 480 }
};

function mockSelectedFixture() {
  mockState('router', { urlParams: { fixturePath: 'zwei.js' } });
}

function loadTestPlugins() {
  loadPlugins({ state: { renderer: rendererState } });
}

function mockSetFixtureStateCall() {
  mockCall('renderer.setFixtureState', prevState => ({
    ...prevState,
    viewport: { width: 640, height: 480 }
  }));
}

it('sets fixture state in plugin state', async () => {
  register();
  mockSelectedFixture();

  loadTestPlugins();
  mockSetFixtureStateCall();

  await wait(() =>
    expect(getPluginState('renderer').fixtureState).toEqual(
      expectedFixtureState
    )
  );
});

it('posts "setFixtureState" renderer requests', async () => {
  register();
  mockSelectedFixture();

  const handleRendererRequest = jest.fn();
  mockEvent('renderer.request', handleRendererRequest);

  loadTestPlugins();
  mockSetFixtureStateCall();

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'setFixtureState',
      payload: {
        rendererId: 'mockRendererId1',
        fixturePath: 'zwei.js',
        fixtureState: expectedFixtureState
      }
    })
  );

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'setFixtureState',
      payload: {
        rendererId: 'mockRendererId2',
        fixturePath: 'zwei.js',
        fixtureState: expectedFixtureState
      }
    })
  );
});
