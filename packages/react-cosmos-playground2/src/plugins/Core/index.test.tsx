import { loadPlugins, resetPlugins } from 'react-plugin';
import { mockStorage, getCoreMethods } from '../../testHelpers/pluginMocks';
import { CoreSpec } from './public';
import { register } from '.';

afterEach(resetPlugins);

const coreConfig: CoreSpec['config'] = {
  projectId: 'mockProjectId',
  fixturesDir: 'mockFixturesDir',
  fixtureFileSuffix: 'mockFixturesFileSuffix',
  devServerOn: true,
  webRendererUrl: 'mockWebUrl'
};

function registerTestPlugins() {
  mockStorage({
    loadCache: () => Promise.resolve(null)
  });
  register();
}

function loadTestPlugins() {
  loadPlugins({
    config: {
      core: coreConfig
    }
  });
}

it('returns project ID', () => {
  registerTestPlugins();
  loadTestPlugins();
  expect(getCoreMethods().getProjectId()).toBe('mockProjectId');
});

it('returns fixture file vars', () => {
  registerTestPlugins();
  loadTestPlugins();
  expect(getCoreMethods().getFixtureFileVars()).toEqual({
    fixturesDir: 'mockFixturesDir',
    fixtureFileSuffix: 'mockFixturesFileSuffix'
  });
});

it('returns dev server on flag', () => {
  registerTestPlugins();
  loadTestPlugins();
  expect(getCoreMethods().isDevServerOn()).toBe(true);
});

it('returns web renderer URL', () => {
  registerTestPlugins();
  loadTestPlugins();
  expect(getCoreMethods().getWebRendererUrl()).toBe('mockWebUrl');
});
