import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { cleanup, getState, getMethodsOf } from '../../../testHelpers/plugin';
import { RendererCoreSpec } from '../public';
import { State } from '../shared';
import { register } from '..';

afterEach(cleanup);

const state: State = {
  connectedRendererIds: ['mockRendererId1', 'mockRendererId2'],
  primaryRendererId: 'mockRendererId1',
  fixtures: {},
  fixtureState: null
};

it('sets primary renderer ID in state', async () => {
  register();
  loadPlugins({ state: { rendererCore: state } });

  const methods = getMethodsOf<RendererCoreSpec>('rendererCore');
  methods.selectPrimaryRenderer('mockRendererId2');

  await wait(() =>
    expect(
      getState<RendererCoreSpec>('rendererCore').primaryRendererId
    ).toEqual('mockRendererId2')
  );
});
