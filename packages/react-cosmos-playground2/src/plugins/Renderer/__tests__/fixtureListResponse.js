// @flow

import { wait } from 'react-testing-library';
import { resetPlugins, registerPlugin, loadPlugins } from 'react-plugin';
import {
  mockFixtureState,
  getFixtureListRes,
  getRendererState
} from '../testHelpers';
import { register } from '..';

afterEach(resetPlugins);

it('creates renderer state', async () => {
  let rendererState;

  loadTestPlugins({}, () => {
    const { init, onState } = registerPlugin({ name: 'test' });
    onState(({ getStateOf }) => {
      rendererState = getStateOf('renderer');
    });
    init(({ callMethod }) => {
      callMethod('renderer.receiveResponse', getFixtureListRes('foo-renderer'));
    });
  });

  await wait(() =>
    expect(rendererState).toEqual({
      primaryRendererId: 'foo-renderer',
      renderers: {
        'foo-renderer': expect.objectContaining({
          fixtureState: null
        })
      }
    })
  );
});

it('creates multiple renderer states', async () => {
  let rendererState;

  loadTestPlugins({}, () => {
    const { init, onState } = registerPlugin({ name: 'test' });
    onState(({ getStateOf }) => {
      rendererState = getStateOf('renderer');
    });
    init(({ callMethod }) => {
      callMethod('renderer.receiveResponse', getFixtureListRes('foo-renderer'));
      callMethod('renderer.receiveResponse', getFixtureListRes('bar-renderer'));
    });
  });

  await wait(() =>
    expect(rendererState).toEqual({
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

it('creates renderer state with fixture state of primary renderer', async () => {
  const initialRendererState = {
    primaryRendererId: 'foo-renderer',
    renderers: {
      'foo-renderer': getRendererState({
        fixtureState: mockFixtureState
      })
    }
  };
  let rendererState;

  loadTestPlugins(initialRendererState, () => {
    const { init, onState } = registerPlugin({ name: 'test' });
    onState(({ getStateOf }) => {
      rendererState = getStateOf('renderer');
    });
    init(({ callMethod }) => {
      callMethod('renderer.receiveResponse', getFixtureListRes('bar-renderer'));
    });
  });

  await wait(() =>
    expect(rendererState).toEqual({
      primaryRendererId: 'foo-renderer',
      renderers: expect.objectContaining({
        'bar-renderer': expect.objectContaining({
          fixtureState: mockFixtureState
        })
      })
    })
  );
});

function loadTestPlugins(initialState, extraSetup = () => {}) {
  register();
  registerPlugin({ name: 'router', initialState: { urlParams: {} } });
  extraSetup();
  loadPlugins({
    state: {
      renderer: initialState
    }
  });
}
