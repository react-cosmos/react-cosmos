import { loadPlugins } from 'react-plugin';
import { cleanup, getMethodsOf } from '../../../testHelpers/plugin';
import { RendererCoreSpec } from '../public';
import { State } from '../shared';
import { register } from '..';

afterEach(cleanup);

function loadTestPlugins(state?: State) {
  loadPlugins({ state: { rendererCore: state } });
}

function isRendererConnected() {
  return getMethodsOf<RendererCoreSpec>('rendererCore').isRendererConnected();
}

it('returns false', async () => {
  register();
  loadTestPlugins();

  expect(isRendererConnected()).toBe(false);
});

it('returns true', async () => {
  register();

  const rendererId = 'mockRendererId';
  loadTestPlugins({
    connectedRendererIds: [rendererId],
    primaryRendererId: rendererId,
    fixtures: {},
    fixtureState: null
  });

  expect(isRendererConnected()).toBe(true);
});
