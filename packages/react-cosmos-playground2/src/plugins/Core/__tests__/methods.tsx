import { loadPlugins } from 'react-plugin';
import { cleanup, getMethodsOf } from '../../../testHelpers/plugin';
import { CoreSpec } from '../public';
import { register } from '..';

afterEach(cleanup);

const coreConfig: CoreSpec['config'] = {
  projectId: 'mockProjectId',
  fixturesDir: 'mockFixturesDir',
  fixtureFileSuffix: 'mockFixturesFileSuffix',
  devServerOn: true,
  webRendererUrl: 'mockWebUrl'
};

function loadTestPlugins() {
  loadPlugins({
    config: {
      core: coreConfig
    }
  });
}

function getCoreMethods() {
  return getMethodsOf<CoreSpec>('core');
}

it('returns project ID', () => {
  register();
  loadTestPlugins();
  expect(getCoreMethods().getProjectId()).toBe('mockProjectId');
});

it('returns fixture file vars', () => {
  register();
  loadTestPlugins();
  expect(getCoreMethods().getFixtureFileVars()).toEqual({
    fixturesDir: 'mockFixturesDir',
    fixtureFileSuffix: 'mockFixturesFileSuffix'
  });
});

it('returns dev server on flag', () => {
  register();
  loadTestPlugins();
  expect(getCoreMethods().isDevServerOn()).toBe(true);
});

it('returns web renderer URL', () => {
  register();
  loadTestPlugins();
  expect(getCoreMethods().getWebRendererUrl()).toBe('mockWebUrl');
});
