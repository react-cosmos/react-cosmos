import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { cleanup, getState, getMethodsOf } from '../../../testHelpers/plugin2';
import { RendererCoordinatorSpec } from '../public';
import { State } from '../shared';
import { register } from '..';

afterEach(cleanup);

const state: State = {
  connectedRendererIds: ['mockRendererId1', 'mockRendererId2'],
  primaryRendererId: 'mockRendererId1',
  fixtures: [],
  fixtureState: null
};

it('sets primary renderer ID in state', async () => {
  register();
  loadPlugins({ state: { rendererCoordinator: state } });

  const methods = getMethodsOf<RendererCoordinatorSpec>('rendererCoordinator');
  methods.selectPrimaryRenderer('mockRendererId2');

  await wait(() =>
    expect(
      getState<RendererCoordinatorSpec>('rendererCoordinator').primaryRendererId
    ).toEqual('mockRendererId2')
  );
});
