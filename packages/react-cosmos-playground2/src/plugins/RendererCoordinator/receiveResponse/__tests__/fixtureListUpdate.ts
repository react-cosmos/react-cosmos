import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { RendererId } from 'react-cosmos-shared2/renderer';
import {
  cleanup,
  getState,
  getMethodsOf,
  mockMethodsOf
} from '../../../../testHelpers/plugin2';
import { RouterSpec } from '../../../Router/public';
import { createFixtureListUpdateResponse } from '../../testHelpers';
import { State } from '../../shared';
import { RendererCoordinatorSpec } from '../../public';
import { register } from '../..';

afterEach(cleanup);

const fixtures = ['ein.js', 'zwei.js', 'drei.js'];
const state: State = {
  connectedRendererIds: ['mockRendererId1', 'mockRendererId2'],
  primaryRendererId: 'mockRendererId1',
  fixtures: ['ein.js', 'zwei.js', 'drei.js'],
  fixtureState: null
};

function registerTestPlugins() {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getUrlParams: () => ({})
  });
}

function loadTestPlugins() {
  loadPlugins({ state: { rendererCoordinator: state } });
}

function mockFixtureListUpdateResponse(rendererId: RendererId) {
  const methods = getMethodsOf<RendererCoordinatorSpec>('rendererCoordinator');
  methods.receiveResponse(
    createFixtureListUpdateResponse(rendererId, [...fixtures, 'vier.js'])
  );
}

function getRendererCoordinatorState() {
  return getState<RendererCoordinatorSpec>('rendererCoordinator');
}

it('updates fixtures in renderer state', async () => {
  registerTestPlugins();
  loadTestPlugins();

  mockFixtureListUpdateResponse('mockRendererId1');

  await wait(() =>
    expect(getRendererCoordinatorState().fixtures).toEqual([
      ...fixtures,
      'vier.js'
    ])
  );
});

it('ignores update from secondary renderer', async () => {
  registerTestPlugins();
  loadTestPlugins();

  mockFixtureListUpdateResponse('mockRendererId2');

  await wait(() =>
    expect(getRendererCoordinatorState().fixtures).toEqual(fixtures)
  );
});
