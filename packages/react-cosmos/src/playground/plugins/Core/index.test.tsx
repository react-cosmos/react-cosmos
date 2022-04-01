import { loadPlugins, resetPlugins } from 'react-plugin';
import { getCoreMethods, mockStorage } from '../../testHelpers/pluginMocks';
import { CoreSpec } from './spec';

beforeEach(() => jest.isolateModules(() => require('.')));

afterEach(resetPlugins);

const coreConfig: CoreSpec['config'] = {
  projectId: 'mockProjectId',
  fixturesDir: 'mockFixturesDir',
  fixtureFileSuffix: 'mockFixturesFileSuffix',
  devServerOn: true,
  webRendererUrl: 'mockWebUrl',
};

function registerTestPlugins() {
  mockStorage({
    loadCache: () => Promise.resolve(null),
  });
}

function loadTestPlugins() {
  loadPlugins({
    config: {
      core: coreConfig,
    },
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
    fixtureFileSuffix: 'mockFixturesFileSuffix',
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

it('sets document title to project ID', () => {
  registerTestPlugins();
  loadTestPlugins();
  expect(document.title).toBe('mockProjectId');
});
