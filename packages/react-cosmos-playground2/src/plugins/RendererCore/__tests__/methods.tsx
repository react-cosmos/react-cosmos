import { loadPlugins } from 'react-plugin';
import { cleanup, getMethodsOf } from '../../../testHelpers/plugin';
import { RendererCoreSpec } from '../public';
import { register } from '..';

afterEach(cleanup);

const rendererCoreState: RendererCoreSpec['state'] = {
  connectedRendererIds: ['mockRendererId1', 'mockRendererId2'],
  primaryRendererId: 'mockRendererId2',
  fixtures: { 'ein.js': null, 'zwei.js': null, 'drei.js': null },
  fixtureState: { components: [] }
};

function loadTestPlugins() {
  loadPlugins({
    state: { rendererCore: rendererCoreState }
  });
}

function getRendererCoreMethods() {
  return getMethodsOf<RendererCoreSpec>('rendererCore');
}

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
  expect(getRendererCoreMethods().getFixtures()).toEqual({
    'ein.js': null,
    'zwei.js': null,
    'drei.js': null
  });
});

it('returns fixture state', () => {
  register();
  loadTestPlugins();
  expect(getRendererCoreMethods().getFixtureState()).toEqual({
    components: []
  });
});
