import { loadPlugins } from 'react-plugin';
import { cleanup, getMethodsOf } from '../../../testHelpers/plugin';
import { RendererCoreSpec } from '../public';
import { register } from '..';

afterEach(cleanup);

const rendererCoreConfig: RendererCoreSpec['config'] = {
  webUrl: 'mockWebUrl',
  enableRemote: true
};

const rendererCoreState: RendererCoreSpec['state'] = {
  connectedRendererIds: ['mockRendererId1', 'mockRendererId2'],
  primaryRendererId: 'mockRendererId2',
  fixtures: ['ein.js', 'zwei.js', 'drei.js'],
  fixtureState: { components: [] }
};

function loadTestPlugins() {
  loadPlugins({
    config: { rendererCore: rendererCoreConfig },
    state: { rendererCore: rendererCoreState }
  });
}

function getRendererCoreMethods() {
  return getMethodsOf<RendererCoreSpec>('rendererCore');
}

it('returns web URL', () => {
  register();
  loadTestPlugins();
  expect(getRendererCoreMethods().getWebUrl()).toBe('mockWebUrl');
});

it('returns remote renderes enabled flag', () => {
  register();
  loadTestPlugins();
  expect(getRendererCoreMethods().remoteRenderersEnabled()).toBe(true);
});

it('returns connected renderer IDs', () => {
  register();
  loadTestPlugins();
  expect(getRendererCoreMethods().getConnectedRendererIds()).toEqual([
    'mockRendererId1',
    'mockRendererId2'
  ]);
});

it('returns primary renderer ID', () => {
  register();
  loadTestPlugins();
  expect(getRendererCoreMethods().getPrimaryRendererId()).toEqual(
    'mockRendererId2'
  );
});

it('returns fixtures', () => {
  register();
  loadTestPlugins();
  expect(getRendererCoreMethods().getFixtures()).toEqual([
    'ein.js',
    'zwei.js',
    'drei.js'
  ]);
});

it('returns fixture state', () => {
  register();
  loadTestPlugins();
  expect(getRendererCoreMethods().getFixtureState()).toEqual({
    components: []
  });
});
